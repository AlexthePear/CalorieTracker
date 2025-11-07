import SwiftUI
import WebKit
import PhotosUI

// MARK: - Config
enum AppConfig {
    static let apiBase = URL(string: "https://calorie-tracker-backend-puce.vercel.app")!   // <- change
    static let callback = URL(string: "myapp://auth-complete")!  // <- keep, also set URL scheme in Info.plist
}

// MARK: - Models
struct Me: Decodable {
    let uid: String
    let username: String
}

// MARK: - API Client
final class APIClient {
    static let shared = APIClient()
    private let session: URLSession
    private init() {
        let cfg = URLSessionConfiguration.default
        cfg.httpShouldSetCookies = true
        cfg.httpCookieAcceptPolicy = .always
        cfg.httpCookieStorage = HTTPCookieStorage.shared
        session = URLSession(configuration: cfg)
    }
    func me() async throws -> Me {
        var req = URLRequest(url: AppConfig.apiBase.appendingPathComponent("/me"))
        req.httpMethod = "GET"
        let (data, resp) = try await session.data(for: req)
        guard let http = resp as? HTTPURLResponse, http.statusCode == 200 else {
            throw URLError(.userAuthenticationRequired)
        }
        return try JSONDecoder().decode(Me.self, from: data)
    }
}

// MARK: - OAuth WebView (sets sid cookie)
import AuthenticationServices
import Combine

@MainActor
final class OAuthController: NSObject, ObservableObject, ASWebAuthenticationPresentationContextProviding {
    @Published var me: Me?                    // drive navigation from this
    private var session: ASWebAuthenticationSession?

    func start() {
        var comps = URLComponents(url: AppConfig.apiBase.appendingPathComponent("/oauth"), resolvingAgainstBaseURL: false)!
        comps.queryItems = [URLQueryItem(name: "state", value: AppConfig.callback.absoluteString)]
        let authURL = comps.url!

        session = ASWebAuthenticationSession(
            url: authURL,
            callbackURLScheme: AppConfig.callback.scheme
        ) { [weak self] callbackURL, error in
            guard error == nil,
                  let url = callbackURL,
                  let sid = URLComponents(url: url, resolvingAgainstBaseURL: false)?
                                .queryItems?.first(where: { $0.name == "sid" })?.value
            else { return }

            CookieJar.setSID(sid)

            Task { // still @MainActor due to class annotation
                if let me = try? await APIClient.shared.me() {
                    self?.me = me                      // <- triggers navigation
                }
            }
        }
        session?.presentationContextProvider = self
        session?.prefersEphemeralWebBrowserSession = false
        _ = session?.start()
    }

    func presentationAnchor(for session: ASWebAuthenticationSession) -> ASPresentationAnchor {
        (UIApplication.shared.connectedScenes.first as? UIWindowScene)?.keyWindow ?? .init()
    }
}

enum CookieJar {
    static func setSID(_ sid: String) {
        guard let host = AppConfig.apiBase.host else { return }
        var props: [HTTPCookiePropertyKey: Any] = [
            .domain: host,
            .path: "/",
            .name: "sid",
            .value: sid,
            .secure: "TRUE",
            .originURL: AppConfig.apiBase
        ]
        if let cookie = HTTPCookie(properties: props) {
            HTTPCookieStorage.shared.setCookie(cookie)
        }
    }
}
// MARK: - Camera View
import UIKit
struct CameraView: UIViewControllerRepresentable {
    var onImage: (UIImage) -> Void

    final class Coordinator: NSObject, UINavigationControllerDelegate, UIImagePickerControllerDelegate {
        let parent: CameraView
        init(_ parent: CameraView) { self.parent = parent }
        func imagePickerController(_ picker: UIImagePickerController,
                                   didFinishPickingMediaWithInfo info: [UIImagePickerController.InfoKey : Any]) {
            if let img = info[.originalImage] as? UIImage { parent.onImage(img) }
            picker.dismiss(animated: true)
        }
        func imagePickerControllerDidCancel(_ picker: UIImagePickerController) {
            picker.dismiss(animated: true)
        }
    }
    func makeCoordinator() -> Coordinator { Coordinator(self) }
    func makeUIViewController(context: Context) -> UIImagePickerController {
        let vc = UIImagePickerController()
        vc.sourceType = .camera
        vc.delegate = context.coordinator
        return vc
    }
    func updateUIViewController(_ uiViewController: UIImagePickerController, context: Context) {}
}
// MARK: - API Client
enum UploadError: Error { case encodeJPEGFailed }

extension APIClient {
    func uploadEntry(image: UIImage,
                     uid: String,
                     extra: [String: String] = [:],
                     fieldName: String = "img",          // <-- was "file"
                     endpoint: String = "/entry") async throws
    {
        guard let data = image.jpegData(compressionQuality: 0.9) else {
            throw UploadError.encodeJPEGFailed
        }

        let url = AppConfig.apiBase.appendingPathComponent(endpoint)
        let boundary = "Boundary-\(UUID().uuidString)"

        var body = Data()
        func append(_ s: String) { body.append(s.data(using: .utf8)!) }

        // text fields
        var all = extra; all["uid"] = uid
        for (k,v) in all {
            append("--\(boundary)\r\n")
            append("Content-Disposition: form-data; name=\"\(k)\"\r\n\r\n")
            append("\(v)\r\n")
        }

        // file part named "img"
        let filename = "photo_\(Int(Date().timeIntervalSince1970)).jpg"
        append("--\(boundary)\r\n")
        append("Content-Disposition: form-data; name=\"\(fieldName)\"; filename=\"\(filename)\"\r\n")
        append("Content-Type: image/jpeg\r\n\r\n")
        body.append(data)
        append("\r\n")
        append("--\(boundary)--\r\n")

        var req = URLRequest(url: url)
        req.httpMethod = "POST"
        req.setValue("multipart/form-data; boundary=\(boundary)", forHTTPHeaderField: "Content-Type")

        let (dataOut, resp) = try await session.upload(for: req, from: body)
        guard let http = resp as? HTTPURLResponse, (200...299).contains(http.statusCode) else {
            // helpful when debugging 422 payloads
            print(String(data: dataOut, encoding: .utf8) ?? "")
            throw URLError(.badServerResponse)
        }
    }
}



// MARK: - Dashboard
struct DashboardView: View {
    let me: Me
    @State private var showCamera = false
    @State private var pickedItem: PhotosPickerItem?
    @State private var image: UIImage?
    @State private var isUploading = false
    @State private var uploadOK = false
    @State private var uploadError: String?

    var body: some View {
        VStack(spacing: 16) {
            Text("Hello, \(me.username)").font(.headline)

            if let image {
                Image(uiImage: image).resizable().scaledToFit()
                    .frame(maxHeight: 300).clipShape(RoundedRectangle(cornerRadius: 12))
            } else {
                RoundedRectangle(cornerRadius: 12).fill(.secondary.opacity(0.2))
                    .overlay(Text("No image")).frame(height: 200)
            }

            HStack {
                Button("Take Photo") { showCamera = true }
                PhotosPicker("Pick From Library", selection: $pickedItem, matching: .images)
            }

            Button(isUploading ? "Uploading…" : "Upload") {
                guard let img = image else { return }
                isUploading = true
                uploadOK = false
                uploadError = nil
                Task {
                    do {
                        try await APIClient.shared.uploadEntry(image: img,
                                                               uid: me.uid,
                                                               extra: ["note": "from iOS"],
                                                               fieldName: "img",          // <-- match server
                                                               endpoint: "/entry")
                        uploadOK = true
                    } catch {
                        uploadError = error.localizedDescription
                    }
                    isUploading = false
                }
            }
            .disabled(image == nil || isUploading)
            .buttonStyle(.borderedProminent)



            if uploadOK { Text("Uploaded").foregroundStyle(.green) }
            if let err = uploadError { Text(err).foregroundStyle(.red) }
        }
        .padding()
        .sheet(isPresented: $showCamera) { CameraView { img in image = img } }
        .onChange(of: pickedItem) { _, new in
            guard let item = new else { return }
            Task {
                if let data = try? await item.loadTransferable(type: Data.self),
                   let ui = UIImage(data: data) { image = ui }
            }
        }
    }
}


// MARK: - Main UI

struct ContentView: View {
    @StateObject private var oauth = OAuthController()
    @State private var path: [Route] = []
    private let me = Me(uid: "alexanderkoo04@gmail.com", username: "Alexander Koo")

        var body: some View {
            DashboardView(me: me)
        }
}

enum Route: Hashable { case dashboard }
