/* eslint-disable react/no-children-prop */
import("./css/button.css");
import("./css/text.css");

import "./App.css";
import {
  BrowserRouter,
  Route,
  Routes,
  useSearchParams,
} from "react-router-dom";

import Client from "./client/Client";
import Home from "./client/components/home/Home";
import Contact from "./client/components/contact/Contact";
import Login from "./client/components/login/Login";

import Register from "./client/components/register/Register";

import Logout from "./client/components/logout/Logout";
import School from "./school/School";
import Company from "./company/Company";
import SchoolDashboard from "./school/components/dashboard/SchoolDashboard";
import CompanyDashboard from "./company/components/dashboard/CompanyDashboard";
import UserDashboard from "./user/components/dashboard/UserDashboard";
import Class from "./school/components/class/Class";
import Students from "./school/components/students/Students";
import Customers from "./company/components/customers/Customers";
import Suppliers from "./company/components/suppliers/Suppliers";
import Teachers from "./school/components/teachers/Teachers";
import Employees from "./company/components/employees/Employees";
import Parents from "./school/components/parents/Parents";
import Users from "./company/components/users/Users";
import Subject from "./school/components/subjects/Subjects";
import Section from "./school/components/sections/Sections";
import Department from "./school/components/departments/Departments";
import Feestype from "./school/components/feestypes/Feestypes";
import Itemtype from "./company/components/itemtypes/Itemtypes";
import Item from "./company/components/items/Items";
import Feestructure from "./school/components/feestructures/Feestructures";
// import Examtype from "./school/components/examtypes/Examtypes";
import Salesinvoice from "./company/components/salesinvoices/Salesinvoices";
import SalesinvoicePrint from "./company/components/salesinvoices/SalesinvoicePrint";
import Receipts from "./company/components/receipts/Receipts";
import ReceiptPrint from "./company/components/receipts/ReceiptPrint";
import ReceiptPrint_MMS from "./company/components/receipts/ReceiptPrint_MMS";

import Expensetypes from "./company/components/expensetypes/Expensetypes";
import Expenses from "./company/components/expenses/Expenses";
import Generalmasters from "./company/components/generalmasters/Generalmasters";

import Journalvouchers from "./company/components/journalvouchers/Journalvouchers";

import Geolocations from "./company/components/geolocations/Geolocations";
import Accountlevels from "./company/components/accountlevels/Accountlevels";
import Accountledgers from "./company/components/acountledgers/Accountledgers";

import Marksheet from "./school/components/marksheets/Marksheets";
import MarksheetPrint from "./school/components/marksheets/MarksheetPrint";

import ClassDetails from "./school/components/class details/ClassDetails";
import StudentDetails from "./student/components/student details/StudentDetails";
import Student from "./student/Student";
import Menu from "./company/components/menu/Menu";
import Role from "./company/components/role/Role";
import Screen from "./company/components/screen/Screen";

import ParentDetails from "./parent/components/parent details/ParentDetails";
import Parent from "./parent/Parent";

import UserDetails from "./user/components/user details/UserDetails";
import User from "./user/User";

import StudentExaminations from "./student/components/examination/StudentExaminations";
import Teacher from "./teacher/Teacher";
import TeacherDetails from "./teacher/components/teacher details/TeacherDetails";
import TeacherExaminations from "./teacher/components/teacher examinations/TeacherExaminations";
import TeacherSchedule from "./teacher/components/periods/TeacherSchedule";
import AssignPeriod2 from "./school/components/assign period/AssignPeriod2";
import AttendanceDetails from "./school/components/attendance/attendance details/AttendanceDetails";
import StudentAttendanceList from "./school/components/attendance/StudentAttendanceList";
import Schedule from "./school/components/periods/Schedule";
import Examinations from "./school/components/examinations/Examinations";
import Questionpapers from "./school/components/questionpapers/Questionpapers";
import AttendanceTeacher from "./teacher/components/attendance/AttendanceTeacher";
import Invoice2 from "./teacher/components/attendance/invoice";
import AttendancePrint from "./teacher/components/attendance/AttendancePrint";
import AttendanceStudent from "./student/components/attendance/AttendanceStudent";
import AttendanceParent from "./parent/components/attendance/AttendanceParent";
import ScheduleStudent from "./student/components/schedule/ScheduleStudent";
import NoticeSchool from "./school/components/notice/NoticeSchool";
import NoticeTeacher from "./teacher/components/notice/Notice";
import NoticeStudent from "./student/components/notice/NoticeStudent";
import ProtectedRoute from "./guards/ProtectedRoute";
import { AuthContext, AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material/styles";
const theme = createTheme();
import darkTheme from "./basic utility components/darkTheme";
import lightTheme from "./basic utility components/lightTheme";
import ThemeToggleButton from "./basic utility components/ThemeToggleButton";
import { useContext, useEffect, useState } from "react";
import ParentExaminations from "./parent/components/examination/ParentExaminations";
import ScheduleParent from "./parent/components/schedule/ScheduleParent";
import NoticeParent from "./parent/components/notice/NoticeParent";
import SchoolReports from "./school/components/reports/SchoolReports";
import SchoolReportsPrint from "./school/components/reports/SchoolReportsPrint";
import ProgressCardPDF from "./school/components/reports/ProgressCardPDF";
import ExpensePrint from "./company/components/expenses/ExpensePrint";
import FinanceReports from "./company/components/reports/FinanceReports";
import FinanceReportsPrint from "./company/components/reports/FinanceReportsPrint";
import ExpenseReportPrint from "./company/components/reports/ExpenseReportPrint";
import IncomeReportPrint from "./company/components/reports/IncomeReportPrint";
import QuestionpaperReportPrint from "./school/components/reports/QuestionpaperReportPrint";
import ChartOfAccountReportPrint from "./company/components/reports/ChartOfAccountReportPrint";

import TrialBalanceReportPrint from "./company/components/reports/TrialBalanceReportPrint";
import ProfitOrLossReportPrint from "./company/components/reports/ProfitOrLossReportPrint";
import BalanceSheetReportPrint from "./company/components/reports/BalanceSheetReportPrint";

import StatementOfAccountStudentReportPrint from "./school/components/reports/StatementOfAccountStudentReportPrint";
import StatementOfAccountLedgerReportPrint from "./company/components/reports/StatementOfAccountLedgerReportPrint";

import StudentListReportPrint from "./school/components/reports/StudentListReportPrint";
import ParentListReportPrint from "./school/components/reports/ParentListReportPrint";

import StaffReports from "./company/components/reports/StaffReports";
import TeacherListReportPrint from "./school/components/reports/TeacherListReportPrint";
import EmployeeListReportPrint from "./company/components/reports/EmployeeListReportPrint";

import StudentReports from "./school/components/reports/StudentReports";
import AttendanceReportPrint from "./school/components/reports/AttendanceReportPrint";
import PendingFeesReportPrint from "./school/components/reports/PendingFeesReportPrint";
import PaidFeesReportPrint from "./school/components/reports/PaidFeesReportPrint";
import Purchaseinvoice from "./company/components/purchaseinvoices/Purchaseinvoices";
import PurchaseinvoicePrint from "./company/components/purchaseinvoices/PurchaseinvoicePrint";

import Supplierpayments from "./company/components/payments/Supplierpayments";
import Payments from "./company/components/payments/Payments";
import PaymentPrint from "./company/components/payments/PaymentPrint";
import PendingExpensesReportPrint from "./company/components/reports/PendingExpensesReportPrint";
import PaidExpensesReportPrint from "./company/components/reports/PaidExpensesReportPrint";
import Numberseqs from "./company/components/numberseqs/Numberseqs";
import Appsettings from "./company/components/appsettings/Appsettings";
import Periods from "./school/components/periods/Periods";
import ScheduleReportPrint from "./school/components/periods/ScheduleReportPrint";
import TeacherScheduleReportPrint from "./teacher/components/periods/TeacherScheduleReportPrint";
import Bonafidecertificates from "./school/components/bonafidecertificates/Bonafidecertificates";
import Transfercertificates from "./school/components/transfercertificates/Transfercertificates";
import Castecertificates from "./school/components/castecertificates/Castecertificates";
import BonafidecertificatePrint from "./school/components/bonafidecertificates/BonafidecertificatePrint";
import TransfercertificatePrint from "./school/components/transfercertificates/TransfercertificatePrint";
import CastecertificatePrint from "./school/components/castecertificates/CastecertificatePrint";

import Attendees from "./school/components/Attendees/Attendees";
import Uploaddata from "./company/components/uploaddata/Uploaddata";
import Enquiry from "./school/components/enquiry/Enquiry";
import EnquiryPrint from "./school/components/enquiry/EnquiryPrint";
import StudentMarksSubjectwisePrint from "./school/components/reports/StudentMarksSubjectwisePrint";
import StudentListMarksSubjectwisePrint from "./school/components/reports/StudentListMarksSubjectwisePrint";
import Sendwhatsapp from "./company/components/sendwhatsapp/Sendwhatsapp";
import ProgressCardPrint from "./school/components/reports/ProgressCardPrint";
import Grades from "./school/components/grades/Grades";
import Taxrates from "./company/components/taxrates/Taxrates";
import GradeListReportPrint from "./school/components/reports/GradeListReportPrint";
import AttendanceSummaryPrint from "./school/components/reports/AttendanceSummaryPrint";
import Workingdays from "./company/components/workingdays/Workingdays";
import Classsubject from "./school/components/classsubject/Classsubject";
import StudentGraphPrint from "./school/components/reports/StudentGraphPrint";
import StudentResultGraphPrint from "./school/components/reports/StudentResultGraphPrint";
import StudentSubjectGraphPrint from "./school/components/reports/StudentSubjectGraphPrint";
import JournalvoucherPrint from "./company/components/journalvouchers/JournalvoucherPrint";
import Accountsetups from "./company/components/accountsetups/Accountsetups";
import SupplierPaymentPrint from "./company/components/payments/SupplierPaymentPrint";

function App() {
  const { authenticated, login, themeDark } = useContext(AuthContext);

  return (
    <>
      <ThemeProvider theme={themeDark ? darkTheme : lightTheme}>
        {/* <ThemeProvider theme={theme}> */}
        {/* <ThemeToggleButton /> */}
        <BrowserRouter>
          <Routes>
            {/* School */}
            <Route
              path="school"
              element={
                <ProtectedRoute allowedRoles={["SCHOOL", "USER"]}>
                  <School />
                </ProtectedRoute>
              }
            >
              <Route index element={<SchoolDashboard />} />
              <Route path="class" element={<Class />} />
              <Route path="class-details" element={<ClassDetails />} />
              <Route path="subject" element={<Subject />} />
              <Route path="section" element={<Section />} />
              <Route path="department" element={<Department />} />
              <Route path="feestype" element={<Feestype />} />
              {/* <Route path="examtype" element={<Examtype />} /> */}
              <Route path="feestructure" element={<Feestructure />} />
              <Route path="salesinvoice" element={<Salesinvoice />} />
              <Route path="salesinvoiceprint" element={<SalesinvoicePrint />} />
              <Route path="receipt" element={<Receipts />} />
              <Route path="receiptprint" element={<ReceiptPrint />} />
              <Route path="receiptprint_mms" element={<ReceiptPrint_MMS />} />
              <Route path="payment" element={<Payments />} />
              <Route path="paymentprint" element={<PaymentPrint />} />
              <Route path="expensetype" element={<Expensetypes />} />
              <Route path="expense" element={<Expenses />} />
              <Route path="expenseprint" element={<ExpensePrint />} />

              <Route path="journalvoucher" element={<Journalvouchers />} />
              <Route
                path="journalvoucherprint"
                element={<JournalvoucherPrint />}
              />

              <Route path="accountlevel" element={<Accountlevels />} />
              <Route path="accountledger" element={<Accountledgers />} />
              <Route path="accountsetup" element={<Accountsetups />} />

              <Route
                path="bonafidecertificate"
                element={<Bonafidecertificates />}
              />
              <Route
                path="bonafidecertificateprint"
                element={<BonafidecertificatePrint />}
              />
              <Route
                path="transfercertificate"
                element={<Transfercertificates />}
              />
              <Route
                path="transfercertificateprint"
                element={<TransfercertificatePrint />}
              />
              <Route path="castecertificate" element={<Castecertificates />} />
              <Route
                path="castecertificateprint"
                element={<CastecertificatePrint />}
              />
              <Route path="enquiry" element={<Enquiry />} />
              <Route path="enquiryprint" element={<EnquiryPrint />} />

              <Route path="attendee" element={<Attendees />} />

              <Route path="students" element={<Students />} />
              <Route path="teachers" element={<Teachers />} />
              <Route path="employees" element={<Employees />} />
              <Route path="parents" element={<Parents />} />
              <Route path="users" element={<Users />} />

              <Route path="menu" element={<Menu />} />
              <Route path="role" element={<Role />} />
              <Route path="screen" element={<Screen />} />

              <Route path="numberseq" element={<Numberseqs />} />
              <Route path="appsetting" element={<Appsettings />} />
              {/* <Route path="generalmaster" element={<Generalmasters />} /> */}
              <Route path="workingdays" element={<Workingdays />} />
              <Route path="classsubject" element={<Classsubject />} />

              <Route path="uploaddata" element={<Uploaddata />} />
              <Route path="sendwhatsapp" element={<Sendwhatsapp />} />

              <Route path="assign-period" element={<AssignPeriod2 />} />
              <Route path="periods" element={<Schedule />} />
              <Route path="period" element={<Periods />} />
              <Route
                path="schedulereportprint"
                element={<ScheduleReportPrint />}
              />

              <Route path="attendance" element={<StudentAttendanceList />} />
              <Route
                path="attendance-student/:studentId"
                element={<AttendanceDetails />}
              />
              <Route path="examinations" element={<Examinations />} />
              <Route path="questionpapers" element={<Questionpapers />} />

              <Route path="marksheet" element={<Marksheet />} />
              <Route path="marksheetprint" element={<MarksheetPrint />} />
              <Route path="grades" element={<Grades />} />
              <Route path="taxrates" element={<Taxrates />} />
              <Route path="schoolreports" element={<SchoolReports />} />
              <Route
                path="schoolreportsprint"
                element={<SchoolReportsPrint />}
              />
              <Route path="financereports" element={<FinanceReports />} />
              <Route
                path="financereportsprint"
                element={<FinanceReportsPrint />}
              />
              <Route
                path="expensereportprint"
                element={<ExpenseReportPrint />}
              />
              <Route path="incomereportprint" element={<IncomeReportPrint />} />
              <Route path="studentreports" element={<StudentReports />} />
              <Route
                path="attendancereportprint"
                element={<AttendanceReportPrint />}
              />
              <Route
                path="questionpaperreportprint"
                element={<QuestionpaperReportPrint />}
              />
              <Route
                path="chartofaccountreportprint"
                element={<ChartOfAccountReportPrint />}
              />

              <Route
                path="trialbalancereportprint"
                element={<TrialBalanceReportPrint />}
              />
              <Route
                path="profitorlossreportprint"
                element={<ProfitOrLossReportPrint />}
              />
              <Route
                path="balancesheetreportprint"
                element={<BalanceSheetReportPrint />}
              />

              <Route
                path="statementofaccountstudentreportprint"
                element={<StatementOfAccountStudentReportPrint />}
              />
              <Route
                path="statementofaccountledgerreportprint"
                element={<StatementOfAccountLedgerReportPrint />}
              />

              <Route path="staffreports" element={<StaffReports />} />
              <Route
                path="studentlistreportprint"
                element={<StudentListReportPrint />}
              />
              <Route
                path="parentlistreportprint"
                element={<ParentListReportPrint />}
              />
              <Route
                path="teacherlistreportprint"
                element={<TeacherListReportPrint />}
              />
              <Route
                path="employeelistreportprint"
                element={<EmployeeListReportPrint />}
              />

              <Route
                path="pendingfeesreportprint"
                element={<PendingFeesReportPrint />}
              />
              <Route
                path="paidfeesreportprint"
                element={<PaidFeesReportPrint />}
              />

              <Route
                path="pendingexpensesreportprint"
                element={<PendingExpensesReportPrint />}
              />
              <Route
                path="paidexpensesreportprint"
                element={<PaidExpensesReportPrint />}
              />

              <Route path="progressCardPDF" element={<ProgressCardPDF />} />
              <Route path="progresscardprint" element={<ProgressCardPrint />} />

              <Route
                path="studentlistmarkssubjectwiseprint"
                element={<StudentListMarksSubjectwisePrint />}
              />
              <Route
                path="studentmarkssubjectwiseprint"
                element={<StudentMarksSubjectwisePrint />}
              />

              <Route
                path="gradelistreportprint"
                element={<GradeListReportPrint />}
              />
              <Route
                path="attendancesummaryprint"
                element={<AttendanceSummaryPrint />}
              />
              <Route path="studentgraphprint" element={<StudentGraphPrint />} />
              <Route
                path="studentresultgraphprint"
                element={<StudentResultGraphPrint />}
              />
              <Route
                path="studentsubjectgraphprint"
                element={<StudentSubjectGraphPrint />}
              />

              <Route path="notice" element={<NoticeSchool />} />
            </Route>

            {/* Company */}
            <Route
              path="company"
              element={
                <ProtectedRoute allowedRoles={["COMPANY", "USER"]}>
                  <Company />
                </ProtectedRoute>
              }
            >
              <Route index element={<CompanyDashboard />} />
              <Route path="department" element={<Department />} />
              <Route path="itemtype" element={<Itemtype />} />
              <Route path="item" element={<Item />} />
              <Route path="salesinvoice" element={<Salesinvoice />} />
              <Route path="salesinvoiceprint" element={<SalesinvoicePrint />} />
              <Route path="receipt" element={<Receipts />} />
              <Route path="receiptprint" element={<ReceiptPrint />} />
              <Route path="receiptprint_mms" element={<ReceiptPrint_MMS />} />
              <Route path="purchaseinvoice" element={<Purchaseinvoice />} />
              <Route
                path="purchaseinvoiceprint"
                element={<PurchaseinvoicePrint />}
              />
              <Route path="supplierpayment" element={<Supplierpayments />} />
              <Route
                path="supplierpaymentprint"
                element={<SupplierPaymentPrint />}
              />
              <Route path="payment" element={<Payments />} />
              <Route path="paymentprint" element={<PaymentPrint />} />
              <Route path="expensetype" element={<Expensetypes />} />
              <Route path="expense" element={<Expenses />} />
              <Route path="expenseprint" element={<ExpensePrint />} />

              <Route path="journalvoucher" element={<Journalvouchers />} />
              <Route
                path="journalvoucherprint"
                element={<JournalvoucherPrint />}
              />

              <Route path="geolocation" element={<Geolocations />} />
              <Route path="accountlevel" element={<Accountlevels />} />
              <Route path="accountledger" element={<Accountledgers />} />
              <Route path="accountsetup" element={<Accountsetups />} />

              <Route path="customers" element={<Customers />} />
              <Route path="suppliers" element={<Suppliers />} />
              <Route path="employees" element={<Employees />} />
              <Route path="users" element={<Users />} />

              <Route path="menu" element={<Menu />} />
              <Route path="role" element={<Role />} />
              <Route path="screen" element={<Screen />} />

              <Route path="numberseq" element={<Numberseqs />} />
              <Route path="appsetting" element={<Appsettings />} />
              <Route path="generalmaster" element={<Generalmasters />} />
              <Route path="workingdays" element={<Workingdays />} />

              <Route path="uploaddata" element={<Uploaddata />} />
              <Route path="sendwhatsapp" element={<Sendwhatsapp />} />

              <Route path="taxrates" element={<Taxrates />} />

              <Route path="financereports" element={<FinanceReports />} />
              <Route
                path="financereportsprint"
                element={<FinanceReportsPrint />}
              />
              <Route
                path="expensereportprint"
                element={<ExpenseReportPrint />}
              />
              <Route path="incomereportprint" element={<IncomeReportPrint />} />

              <Route
                path="chartofaccountreportprint"
                element={<ChartOfAccountReportPrint />}
              />

              <Route
                path="trialbalancereportprint"
                element={<TrialBalanceReportPrint />}
              />
              <Route
                path="profitorlossreportprint"
                element={<ProfitOrLossReportPrint />}
              />
              <Route
                path="balancesheetreportprint"
                element={<BalanceSheetReportPrint />}
              />

              <Route
                path="statementofaccountstudentreportprint"
                element={<StatementOfAccountStudentReportPrint />}
              />
              <Route
                path="statementofaccountledgerreportprint"
                element={<StatementOfAccountLedgerReportPrint />}
              />

              <Route
                path="employeelistreportprint"
                element={<EmployeeListReportPrint />}
              />

              <Route
                path="paidexpensesreportprint"
                element={<PaidExpensesReportPrint />}
              />

              <Route path="notice" element={<NoticeSchool />} />
            </Route>

            {/* Student */}
            <Route
              path="student"
              element={
                <ProtectedRoute allowedRoles={["STUDENT"]}>
                  <Student />
                </ProtectedRoute>
              }
            >
              <Route index element={<StudentDetails />} />
              <Route path="student-details" element={<StudentDetails />} />
              <Route path="examinations" element={<StudentExaminations />} />
              {/* <Route path='periods' element={<ScheduleStudent />} /> */}
              {/* <Route path="attendance" element={<AttendanceStudent />} /> */}

              <Route path="periodschedule" element={<Schedule />} />
              <Route
                path="schedulereportprint"
                element={<ScheduleReportPrint />}
              />

              <Route path="studentreports" element={<StudentReports />} />
              <Route
                path="attendancereportprint"
                element={<AttendanceReportPrint />}
              />

              <Route
                path="schoolreportsprint"
                element={<SchoolReportsPrint />}
              />
              <Route
                path="questionpaperreportprint"
                element={<QuestionpaperReportPrint />}
              />
              <Route path="progresscardprint" element={<ProgressCardPrint />} />

              <Route path="notice" element={<NoticeStudent />} />
            </Route>

            {/* Teacher */}
            <Route
              path="teacher"
              element={
                <ProtectedRoute allowedRoles={["TEACHER"]}>
                  <Teacher />
                </ProtectedRoute>
              }
            >
              <Route index element={<TeacherDetails />} />
              <Route path="details" element={<TeacherDetails />} />
              <Route path="examinations" element={<TeacherExaminations />} />
              <Route path="teacherreports" element={<SchoolReports />} />
              <Route
                path="questionpaperreportprint"
                element={<QuestionpaperReportPrint />}
              />
              <Route
                path="schoolreportsprint"
                element={<SchoolReportsPrint />}
              />

              <Route path="periods" element={<TeacherSchedule />} />
              <Route
                path="teacherschedulereportprint"
                element={<TeacherScheduleReportPrint />}
              />
              {/* <Route path='sub-teach' element={<StudentSubjectTeacher/>} /> */}
              <Route path="attendance" element={<AttendanceTeacher />} />
              <Route path="invoice2" element={<Invoice2 />} />
              <Route path="AttendancePrint" element={<AttendancePrint />} />
              <Route
                path="attendancereportprint"
                element={<AttendanceReportPrint />}
              />
              <Route path="notice" element={<NoticeTeacher />} />

              <Route path="marksheet" element={<Marksheet />} />
              <Route path="marksheetprint" element={<MarksheetPrint />} />

              <Route path="questionpapers" element={<Questionpapers />} />

              <Route
                path="studentlistmarkssubjectwiseprint"
                element={<StudentListMarksSubjectwisePrint />}
              />
              <Route
                path="studentmarkssubjectwiseprint"
                element={<StudentMarksSubjectwisePrint />}
              />
              <Route path="progresscardprint" element={<ProgressCardPrint />} />
            </Route>

            {/* Client */}
            <Route path="/" element={<Client />}>
              <Route index element={<Home />} />
              <Route path="home" element={<Home />} />
              <Route path="contact" element={<Contact />} />
              <Route path="login" element={<Login />} />
              <Route path="/login/:role" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="logout" element={<Logout />} />
            </Route>

            {/* Parent */}
            <Route
              path="parent"
              element={
                <ProtectedRoute allowedRoles={["PARENT"]}>
                  <Parent />
                </ProtectedRoute>
              }
            >
              <Route index element={<ParentDetails />} />
              <Route path="parent-details" element={<ParentDetails />} />
              {/* <Route path="examinations" element={<ParentExaminations />} />
              <Route path='periods' element={<ScheduleParent />} />
              <Route path="attendance" element={<AttendanceParent />} /> */}

              <Route path="periodschedule" element={<Schedule />} />
              <Route
                path="schedulereportprint"
                element={<ScheduleReportPrint />}
              />

              <Route path="studentreports" element={<StudentReports />} />
              <Route
                path="attendancereportprint"
                element={<AttendanceReportPrint />}
              />

              <Route
                path="schoolreportsprint"
                element={<SchoolReportsPrint />}
              />
              <Route
                path="questionpaperreportprint"
                element={<QuestionpaperReportPrint />}
              />
              <Route path="progresscardprint" element={<ProgressCardPrint />} />
              <Route path="notice" element={<NoticeParent />} />
            </Route>

            {/* User */}
            <Route
              path="user"
              element={
                <ProtectedRoute allowedRoles={["USER"]}>
                  <User />
                </ProtectedRoute>
              }
            >
              <Route index element={<UserDashboard />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
}

export default App;
