import { Routes, Route } from "react-router-dom";
import UserList from "../components/Employee/UserList";
import AddUser from "../components/Employee/AddUser";
import EditUser from "../components/Employee/EditUser";
import AddJob from "../components/JobTitle/AddJob";
import AddSalary from "../components/Salary/AddSalary";
import JobList from "../components/JobTitle/JobList";
import SalaryList from "../components/Salary/SalaryList";
import EditSalary from "../components/Salary/EditSalary";
import EditJob from "../components/JobTitle/EditJob";
import Navbar from "../components/UI/Navbar";
import Footer from "../components/UI/Footer";
import Resume from "../components/UI/Resume";

function HomePage() {
  return (
    <div
      className="app-container is-flex is-flex-direction-column"
      style={{ minHeight: "100vh" }}
    >
      <Navbar />
      <div className="content is-flex-grow-1">
        <Routes>
          <Route index element={<Resume />} /> {/* Show Resume when no route is matched */}
          <Route path="AddSalary" element={<AddSalary />} />
          <Route path="AddEmployee" element={<AddUser />} />
          <Route path="AddJob" element={<AddJob />} />
          <Route path="editJobTitle/:id" element={<EditJob />} />
          <Route path="editSalary/:id" element={<EditSalary />} />
          <Route path="edit/:id" element={<EditUser />} />
          <Route path="EmployeeList" element={<UserList />} />
          <Route path="JobTitleList" element={<JobList />} />
          <Route path="SalaryList" element={<SalaryList />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default HomePage;
