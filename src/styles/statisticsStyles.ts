import { StyleSheet } from "react-native";
import { COLORS } from "@/styles/theme";

export const statisticsStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.darkBrown },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },
  backBtn: { padding: 8, marginLeft: -8 },
  headerTitle: { color: COLORS.white, fontSize: 18, fontWeight: "bold" },
  scroll: { padding: 16, paddingBottom: 40, gap: 16 },
  card: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    padding: 16,
  },
  cardTitle: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
  },

  overviewRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  overviewItem: { alignItems: "center" },
  overviewValue: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: "bold",
    flexDirection: "row",
    alignItems: "center",
  },
  overviewLabel: { color: "rgba(255,255,255,0.6)", fontSize: 14, marginTop: 4 },
  overviewDivider: {
    width: 1,
    height: 40,
    backgroundColor: "rgba(255,255,255,0.1)",
  },

  barRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  starText: { color: COLORS.white, width: 40, fontSize: 14 },
  barBackground: {
    flex: 1,
    height: 12,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 6,
    marginHorizontal: 12,
  },
  barFill: { height: 12, backgroundColor: "#FFD700", borderRadius: 6 },
  countText: {
    color: COLORS.white,
    width: 30,
    textAlign: "right",
    fontSize: 14,
  },

  contextTabs: { flexDirection: "row", marginBottom: 16 },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    marginRight: 8,
  },
  tabActive: { backgroundColor: COLORS.mediumBrown },
  tabText: { color: "rgba(255,255,255,0.6)", fontSize: 14 },
  tabTextActive: { color: COLORS.cream, fontWeight: "bold" },

  criterionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  criterionName: { color: "rgba(255,255,255,0.8)", fontSize: 15 },
  criterionValue: { color: COLORS.cream, fontSize: 15, fontWeight: "bold" },
  emptyText: {
    color: "rgba(255,255,255,0.4)",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 10,
  },

  timelineContainer: { gap: 12 },
  timelineRow: { flexDirection: "row", alignItems: "center" },
  timelineMonth: { color: "rgba(255,255,255,0.6)", width: 60, fontSize: 12 },
  timelineBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 4,
    marginHorizontal: 8,
  },
  timelineBarFill: {
    height: 8,
    backgroundColor: COLORS.mediumBrown,
    borderRadius: 4,
  },
  timelineAvg: {
    color: COLORS.cream,
    width: 30,
    textAlign: "right",
    fontWeight: "bold",
  },
});
