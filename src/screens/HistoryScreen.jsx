import tokens from "../theme/tokens";
import TopAppBar from "../components/TopAppBar";
import Icon from "../components/Icon";
import NavCard from "../components/NavCard";

const transactions = [
  { id: "TXN-001", time: "2:34 PM", amount: "$23.30", items: 4, status: "Approved" },
  { id: "TXN-002", time: "1:15 PM", amount: "$9.00", items: 2, status: "Approved" },
  { id: "TXN-003", time: "11:42 AM", amount: "$14.50", items: 3, status: "Declined" },
];

export default function HistoryScreen({ navigate, goBack }) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: tokens.color.bg.brand,
      }}
    >
      <TopAppBar title="Transaction History" onBack={goBack} theme="dark" />
      <div
        style={{
          flex: 1,
          overflow: "auto",
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          alignContent: "start",
        }}
      >
        <NavCard icon="receipt" label="Last Transaction" onClick={() => {}} />
        <NavCard icon="search" label="Search by RRN" onClick={() => {}} />
        <NavCard icon="search" label="Search by Card No" onClick={() => {}} />
        <NavCard icon="search" label="Search by Date" onClick={() => {}} />
        <NavCard icon="history" label="Browse All Transactions" onClick={() => {}} />
      </div>
    </div>
  );
}
