//
//  HomeClearAppApp.swift
//  HomeClearApp
//
//  Created by Jarryd Addinall on 11/11/2025.
//

import SwiftUI
import FirebaseCore

@main
struct HomeClearAppApp: App {
    init() {
        FirebaseApp.configure()
    }

    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
