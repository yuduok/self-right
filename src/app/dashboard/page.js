import AuthCheck from "@/component/AuthCheck/AuthCheck";

const Dashboard = () => {
  return (
    <AuthCheck>
      <div className="p-10">
        <h1 className="text-3xl font-bold text-center">Dashboard</h1>
      </div>
    </AuthCheck>
  );
};

export default Dashboard;