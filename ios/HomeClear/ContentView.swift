import SwiftUI

struct ContentView: View {
    var body: some View {
        NavigationView {
            VStack(spacing: 16) {
                Image(systemName: "house.fill")
                    .font(.system(size: 48))
                    .foregroundColor(.accentColor)

                Text("HomeClear iOS Shell")
                    .font(.title2)
                    .fontWeight(.semibold)

                Text("Hook this screen up to Firebase or your API to mirror the web transaction hub.")
                    .font(.body)
                    .multilineTextAlignment(.center)
                    .foregroundColor(.secondary)
                    .padding(.horizontal, 32)
            }
            .padding()
            .navigationTitle("Dashboard")
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}

