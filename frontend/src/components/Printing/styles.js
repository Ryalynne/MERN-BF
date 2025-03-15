import { StyleSheet, Font } from "@react-pdf/renderer";

// Register the Poppins font
Font.register({
  family: "Poppins",
  src: "https://raw.githubusercontent.com/google/fonts/main/ofl/poppins/Poppins-Regular.ttf",
});

const styles = StyleSheet.create({
  page: {
    padding: 30, // Increased padding for better spacing
    fontSize: 10, // Slightly smaller font for a cleaner look
    fontFamily: "Poppins",
    backgroundColor: "#ffffff", // White for a crisp, modern background
  },

  header: {
    fontSize: 18, // Reduced for better proportion
    textAlign: "center",
    marginBottom: 25, // More spacing below the header
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#34495E", // Lighter, modern shade
    letterSpacing: 1, // Adds elegance
  },

  table: {
    display: "table",
    width: "100%",
    borderRadius: 5,
    overflow: "hidden",
    border: "1px solid #ddd", // Light border for definition
  },

  /** Table Header */
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#34495E", // Consistent with header color
    padding: 8, // Compact padding
  },

  tableHeaderCell: {
    flex: 1,
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 10, // Smaller for a modern look
    textTransform: "uppercase",
    letterSpacing: 0.5, // Improves readability
  },

  emailHeaderCell: {
    flex: 2.5, // Matches emailCell width
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  /** Table Rows */
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#e0e0e0", // Softer border color
    backgroundColor: "#ffffff", // Clean white background
  },

  tableRowAlternate: {
    backgroundColor: "#f5f5f5", // Subtle gray for alternating rows
  },

  tableCell: {
    flex: 1,
    padding: 8, // Reduced for compactness
    fontSize: 10, // Consistent smaller size
    textAlign: "center", // Default alignment
    color: "#2C3E50", // Darker text for readability
  },

  emailCell: {
    flex: 2.5, // Wider for emails
    color: "#2980B9", // Blue for distinction
    padding: 8,
    fontSize: 10,
    textAlign: "left", // Left-aligned for readability
    wordBreak: "break-word", // Handles long emails
  },

  salaryCell: {
    flex: 1,
    padding: 8,
    fontSize: 10,
    textAlign: "right", // Right-aligned for numbers
    fontWeight: "bold",
    color: "#27AE60", // Green for financial data
  },

  annualSalaryCell: {
    flex: 1,
    padding: 8,
    fontSize: 10,
    textAlign: "right", // Right-aligned for numbers
    fontWeight: "bold",
    color: "#27AE60", // Consistent green
  },
});

export default styles;