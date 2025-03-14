import React from "react";
import { Page, Text, View, Document } from "@react-pdf/renderer";
import styles from "./styles"; // Import shared styles

const SalaryPDF = ({ salaries }) => {
  const currentDate = new Date().toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Salary Table</Text>
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            {/* <Text style={styles.tableHeaderCell}>Salary ID</Text> */}
            <Text style={styles.tableHeaderCell}>Job Title</Text>
            <Text style={styles.tableHeaderCell}>Position / Level</Text>
            <Text style={styles.tableHeaderCell}>Salary</Text>
          </View>

          {/* Table Data */}
          {salaries.map((user, index) => (
            <View
              style={[
                styles.tableRow,
                index % 2 !== 0 ? styles.tableRowAlternate : null, // Alternate row colors
              ]}
              key={user.id}
            >
              {/* <Text style={styles.tableCell}>{user.id}</Text> */}
              <Text style={styles.tableCell}>{user.Job_Title}</Text>
              <Text style={styles.tableCell}>{user.position}</Text>
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

export default SalaryPDF;
