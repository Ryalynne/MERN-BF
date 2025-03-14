import React from "react";
import { Page, Text, View, Document } from "@react-pdf/renderer";
import styles from "./styles"; // Import shared styles

const EmployeePDF = ({ users }) => {
  const currentDate = new Date().toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Employee Table</Text>
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderCell}>Employee ID</Text>
            <Text style={styles.tableHeaderCell}>Full Name</Text>
            <Text style={styles.emailHeaderCell}>Email</Text>{" "}
            {/* Use new style for email header */}
            <Text style={styles.tableHeaderCell}>Job Title</Text>
            <Text style={styles.tableHeaderCell}>Salary</Text>
          </View>

          {/* Table Data */}
          {users.map((user, index) => (
            <View
              style={[
                styles.tableRow,
                index % 2 !== 0 ? styles.tableRowAlternate : null,
              ]}
              key={user.id}
            >
              <Text style={styles.tableCell}>{user.id}</Text>
              <Text style={styles.tableCell}>{user.full_name}</Text>
              <Text style={[styles.tableCell, styles.emailCell]}>
                {user.email}
              </Text>
              <Text style={styles.tableCell}>{user.Job_Title}</Text>
              <Text style={styles.salaryCell}>
                {user.salary
                  ? parseFloat(user.salary).toLocaleString("en-PH", {
                      minimumFractionDigits: 2,
                    })
                  : "N/A"}
              </Text>
            </View>
          ))}
        </View>

        {/* Date Printed */}
        <Text style={styles.datePrinted}>Date Printed: {currentDate}</Text>
      </Page>
    </Document>
  );
};

export default EmployeePDF;
