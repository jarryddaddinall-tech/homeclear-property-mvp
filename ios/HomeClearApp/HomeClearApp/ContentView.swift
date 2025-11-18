import SwiftUI

struct Transaction: Identifiable {
    let id = UUID()
    let address: String
    let price: Double
    let buyerName: String
    let currentStageIndex: Int
    let lastUpdate: String
}

private let stageNames = [
    "Offer accepted",
    "Solicitors appointed",
    "MOS drafted and sent",
    "AML, lending and compliance",
    "Draft contract pack issued",
    "Mortgage application & valuation",
    "Searches ordered",
    "Enquiries raised & responded",
    "Mortgage offer issued",
    "Report on title & signatures",
    "Exchange of contracts",
    "Completion",
    "Post-completion"
]

private let previewTransactions = [
    Transaction(
        address: "123 Maple Street, London SW1A 1AA",
        price: 350_000,
        buyerName: "Sarah Johnson",
        currentStageIndex: 3,
        lastUpdate: "Updated 2h ago"
    ),
    Transaction(
        address: "45 Modern Terrace, Manchester M1 2AB",
        price: 425_000,
        buyerName: "Michael Chen",
        currentStageIndex: 5,
        lastUpdate: "Updated yesterday"
    )
]

struct ContentView: View {
    @State private var transactions = previewTransactions
    @State private var selectedTransaction: Transaction?

    var body: some View {
        NavigationSplitView {
            List(transactions) { transaction in
                Button {
                    selectedTransaction = transaction
                } label: {
                    TransactionRow(transaction: transaction)
                }
                .buttonStyle(.plain)
            }
            .navigationTitle("Transactions")
            .toolbar {
                Button {
                    addTransaction()
                } label: {
                    Label("Add", systemImage: "plus")
                }
            }
        } detail: {
            if let transaction = selectedTransaction {
                TransactionDetail(transaction: transaction)
            } else {
                DashboardEmptyState()
            }
        }
    }

    private func addTransaction() {
        let newTransaction = Transaction(
            address: "New transaction",
            price: 0,
            buyerName: "Buyer TBD",
            currentStageIndex: 0,
            lastUpdate: "Just created"
        )
        transactions.append(newTransaction)
        selectedTransaction = newTransaction
    }
}

struct DashboardEmptyState: View {
    var body: some View {
        VStack(spacing: 16) {
            Image(systemName: "house.circle")
                .font(.system(size: 48))
                .foregroundColor(.accentColor)
            Text("Select a transaction")
                .font(.title2)
                .fontWeight(.semibold)
            Text("Pick a deal from the list or create a new one to view the buyer timeline and milestones.")
                .font(.body)
                .multilineTextAlignment(.center)
                .foregroundColor(.secondary)
                .padding(.horizontal, 32)
        }
    }
}

struct TransactionRow: View {
    let transaction: Transaction

    private var currentStageName: String {
        stageNames[safe: transaction.currentStageIndex] ?? "In progress"
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(transaction.address)
                .font(.headline)

            if transaction.price > 0 {
                Text("£\(transaction.price.formatted(.number.precision(.fractionLength(0))))")
                    .foregroundColor(.secondary)
            }

            HStack(spacing: 8) {
                StageBadge(title: currentStageName)
                Text(transaction.lastUpdate)
                    .font(.caption)
                    .foregroundColor(.secondary)
            }

            ProgressView(value: Double(transaction.currentStageIndex),
                         total: Double(max(stageNames.count - 1, 1)))
                .tint(.accentColor)
        }
        .padding(.vertical, 8)
    }
}

struct TransactionDetail: View {
    let transaction: Transaction

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                Text(transaction.address)
                    .font(.title)
                    .fontWeight(.bold)

                if transaction.price > 0 {
                    Label("£\(transaction.price.formatted(.number.precision(.fractionLength(0))))", systemImage: "sterlingsign.circle")
                        .font(.title3)
                }

                Label(transaction.buyerName, systemImage: "person.crop.circle")
                    .foregroundColor(.secondary)

                SectionHeader(title: "Progress")

                VStack(alignment: .leading, spacing: 12) {
                    ForEach(stageNames.indices, id: \.self) { index in
                        HStack {
                            Image(systemName: index <= transaction.currentStageIndex ? "checkmark.circle.fill" : "circle")
                                .foregroundColor(index <= transaction.currentStageIndex ? .green : .gray.opacity(0.4))
                            Text(stageNames[index])
                                .foregroundColor(index <= transaction.currentStageIndex ? .primary : .secondary)
                        }
                    }
                }

                Spacer(minLength: 24)

                Text("Hook this screen up to Firestore or your API to mirror the web timeline, documents, and tasks.")
                    .font(.footnote)
                    .foregroundColor(.secondary)
            }
            .padding()
        }
        .navigationTitle("Overview")
    }
}

struct StageBadge: View {
    let title: String

    var body: some View {
        Text(title)
            .font(.caption)
            .fontWeight(.semibold)
            .padding(.horizontal, 10)
            .padding(.vertical, 6)
            .background(Color.blue.opacity(0.1))
            .foregroundColor(.blue)
            .clipShape(Capsule())
    }
}

struct SectionHeader: View {
    let title: String

    var body: some View {
        Text(title)
            .font(.headline)
            .padding(.top, 8)
    }
}

// MARK: - Helpers
extension Collection {
    subscript(safe index: Index) -> Element? {
        indices.contains(index) ? self[index] : nil
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}

