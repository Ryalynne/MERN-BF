import { StyleSheet, Font } from "@react-pdf/renderer";

// Register the Poppins font
Font.register({
  family: "Poppins",
  src: "https://raw.githubusercontent.com/google/fonts/main/ofl/poppins/Poppins-Regular.ttf",
});

const styles = StyleSheet.create({
  page: {
    padding: 25,
    fontSize: 11,
    fontFamily: "Poppins",
    backgroundColor: "#f9f9f9",
  },

  header: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#2C3E50",
  },

  table: {
    display: "table",
    width: "100%",
    borderRadius: 5,
    overflow: "hidden",
  },

  /** Table Header */
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#2C3E50",
    padding: 10,
  },

  tableHeaderCell: {
    flex: 1,
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 12,
    textTransform: "uppercase",
    padding: 8,
  },

  emailHeaderCell: {
    flex: 2.5, // Matches emailCell for proper alignment
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center", // Centers header text
    fontSize: 12,
    textTransform: "uppercase",
    padding: 8,
  },

  /** Table Rows */
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },

  tableRowAlternate: {
    backgroundColor: "#f2f2f2",
  },

  tableCell: {
    flex: 1,
    borderRightWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    fontSize: 11,
    textAlign: "center",
    color: "#34495E",
  },

  emailCell: {
    flex: 2.5, // Ensures email column is wider for long emails
    color: "#2980B9",
    padding: 10,
    fontSize: 11,
    textAlign: "left",
    wordBreak: "break-word", // Wraps long email addresses
  },

  salaryCell: {
    flex: 1,
    padding: 10,
    fontSize: 11,
    textAlign: "right",
    fontWeight: "bold",
    color: "#27AE60",
  },

  annualSalaryCell: {
    flex: 1,
    padding: 10,
    fontSize: 11,
    textAlign: "right",
    fontWeight: "bold",
    color: "#27AE60",
  },
});

export default styles;
