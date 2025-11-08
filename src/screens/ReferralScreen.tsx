import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Share,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "../hooks/useTranslation";
import { getUser } from "../utils/TokenManager";
import ReferralShareBottomSheet from "../component/ReferralShareBottomSheet";
import ReferralDetailBottomSheet from "../component/ReferralDetailBottomSheet";
import NoDataModal from "../component/NoDataModal";
import api from "../utils/Api";

const ReferralScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  // Helper function to format VND amounts
  const formatVndAmount = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M đ`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(0)}K đ`;
    } else {
      return `${amount.toLocaleString()} đ`;
    }
  };

  const [refCode, setRefCode] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [invitedCount, setInvitedCount] = useState(0);
  const [totalVnd, setTotalVnd] = useState(0);
  const [receivedVnd, setReceivedVnd] = useState(0);
  const [availableVnd, setAvailableVnd] = useState(0);
  const [pendingVnd, setPendingVnd] = useState(0);
  const [commissionData, setCommissionData] = useState<any[]>([]);
  const [invitedUsers, setInvitedUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [shareOpen, setShareOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailMode, setDetailMode] = useState<"history" | "invited" | "withdraw">("withdraw");
  const [noDataModalVisible, setNoDataModalVisible] = useState(false);

  useEffect(() => {
    loadCommissionData();
    loadInvitedUsers();
  }, []);

  const loadCommissionData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/client/commission/data");
      if (res.data.status) {
        console.log("loadCommissionData", res.data);
        const d = res.data;
        setTotalVnd(d.tong_tien || 0);
        setReceivedVnd(d.tong_tien_rut || 0);
        setAvailableVnd(d.kha_dung || 0);
        setPendingVnd(d.dang_cho || 0);
        setInvitedCount(d.count_ban_be || 0);
        setCommissionData(d.data || []);
      }
    } catch {
      setCommissionData([]);
    } finally {
      setLoading(false);
    }
  };

  const loadInvitedUsers = async () => {
    try {
      const res = await api.get("/client/commission/data-ref");
      console.log(res.data);
      if (res.data.status) setInvitedUsers(res.data.data || []);
    } catch {
      setInvitedUsers([]);
    }
  };

  const createRefCode = async () => {
    try {
      const user = await getUser();
      const email = user?.email;
      if (!email)
        return Alert.alert(t("common.error"), "Email không tồn tại trong hồ sơ");
      const res = await api.post("/client/create-ma-ref", { email });
      if (res.data.status) {
        setRefCode(res.data.data);
        setInviteLink(res.data.link);
        setShareOpen(true);
      } else Alert.alert("Lỗi", res.data.message);
    } catch (e: any) {
      if (e?.response?.status === 422) {
        console.log("e", e.response.data);
        setNoDataModalVisible(true);
      }
    }
  };

  const handleWithdraw = () => navigation.navigate("CommissionWithdraw" as never);
  const openDetailSheet = (mode: "history" | "invited" | "withdraw") => {
    setDetailMode(mode);
    setDetailOpen(true);
  };
  const handleShare = () => Share.share({ message: inviteLink });

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" size={26} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("profile.referral")}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>
        {/* HERO */}
        <View style={styles.hero}>
          <Image
            source={require("../assets/images/friend-rafiki.png")}
            style={styles.heroImg}
          />
          <Text style={styles.heroTitle}>Giới thiệu bạn bè & nhận thưởng</Text>
          <Text style={styles.heroDesc}>
            Mỗi khi bạn bè đăng ký qua liên kết của bạn — bạn nhận thưởng!
          </Text>
          <TouchableOpacity style={styles.shareBtn} onPress={createRefCode}>
            <Icon name="account-multiple-plus" size={18} color="#FFF" />
            <Text style={styles.shareBtnText}>Tạo & chia sẻ liên kết</Text>
          </TouchableOpacity>
        </View>

        {/* STATS */}
        <View style={styles.statsCard}>
          {[
            { icon: "wallet", label: "Khả dụng", value: availableVnd, color: "#007AFF" },
            { icon: "clock-outline", label: "Đang chờ", value: pendingVnd, color: "#FFA000" },
            { icon: "check-circle", label: "Đã nhận", value: receivedVnd, color: "#4CAF50" },
          ].map((item, i) => (
            <View style={styles.statItem} key={i}>
              <View style={[styles.statIcon, { backgroundColor: `${item.color}15` }]}>
                <Icon name={item.icon} size={20} color={item.color} />
              </View>
              <Text style={[styles.statValue, { color: item.color }]}>
                {formatVndAmount(item.value)}
              </Text>
              <Text style={styles.statLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* QUICK ACTIONS */}
        <View style={styles.quickActions}>
          {[
            { icon: "cash-multiple", label: "Rút tiền", action: () => openDetailSheet("withdraw") },
            { icon: "history", label: "Lịch sử", action: () => openDetailSheet("history") },
            { icon: "account-group", label: "Bạn bè", action: () => openDetailSheet("invited") },
          ].map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionButton}
              onPress={item.action}
              activeOpacity={0.85}
            >
              <View style={styles.actionIcon}>
                <Icon name={item.icon} size={20} color="#007AFF" />
              </View>
              <Text style={styles.actionLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* INVITED USERS */}
        {invitedUsers.length > 0 ? (
          <View style={styles.invitedCard}>
            <Text style={styles.sectionTitle}>Bạn bè đã mời ({invitedUsers.length})</Text>
            {invitedUsers.slice(0, 3).map((u, i) => (
              <TouchableOpacity onPress={() => openDetailSheet("invited")} style={styles.invitedItem} key={i}>
                <View style={styles.invitedLeft}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarTxt}>{u.full_name.charAt(0).toUpperCase()}</Text>
                  </View>
                  <View>
                    <Text style={styles.invitedName}>{u.full_name}</Text>
                    <Text style={styles.invitedMail}>{u.email}</Text>
                  </View>
                </View>
                {
                  u.tong_hoa_hong > 0 ? (
                    <Text style={styles.invitedReward}>+{formatVndAmount(u.tong_hoa_hong)}</Text>
                  ) : (
                    <Text style={styles.invitedReward}>-</Text>
                  )
                }
              </TouchableOpacity>
            ))}
            {invitedUsers.length > 3 && (
              <TouchableOpacity onPress={() => openDetailSheet("invited")} style={styles.moreBtn}>
                <Text style={styles.moreTxt}>Xem tất cả</Text>
                <Icon name="chevron-right" size={16} color="#007AFF" />
              </TouchableOpacity>
            )}
          </View>
        ) : (
          // ✅ Empty State Rafiki
          <View style={styles.emptyBox}>
            <Image
              source={require("../assets/images/Questions-rafiki.png")}
              style={styles.emptyImg}
            />
            <Text style={styles.emptyTitle}>Chưa có người nào được mời</Text>
            <Text style={styles.emptyDesc}>
              Hãy chia sẻ liên kết của bạn để nhận thưởng từ MIMO 🎁 
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Sheets */}
      <ReferralShareBottomSheet
        visible={shareOpen}
        onClose={() => setShareOpen(false)}
        inviteLink={inviteLink}
        invitedCount={invitedCount}
        onShare={handleShare}
      />
      <ReferralDetailBottomSheet
        visible={detailOpen}
        onClose={() => setDetailOpen(false)}
        totalVnd={totalVnd}
        receivedVnd={receivedVnd}
        availableVnd={availableVnd}
        pendingVnd={pendingVnd}
        invitedCount={invitedCount}
        commissionData={commissionData}
        invitedUsers={invitedUsers}
        onWithdraw={handleWithdraw}
        mode={detailMode}
      />
      
      <NoDataModal
        visible={noDataModalVisible}
        onClose={() => setNoDataModalVisible(false)}
        title="Bạn chưa có giao dịch nào"
        message="Vui lòng thực hiện giao dịch mua và bán USDT tối thiểu 1 USDT mỗi loại trước khi tạo mã referral!"
        buttonText="Đóng"
        animationSize={180}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  headerTitle: { fontSize: wp("4.6%"), fontWeight: "700", color: "#111" },

  hero: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    marginBottom: 20,
  },
  heroImg: { width: "100%", height: hp("18%") },
  heroTitle: { fontWeight: "700", fontSize: wp("4.5%"), color: "#111", marginTop: 12 },
  heroDesc: {
    textAlign: "center",
    color: "#666",
    fontSize: wp("3.5%"),
    lineHeight: 20,
    marginVertical: 8,
  },
  shareBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 25,
    gap: 8,
  },
  shareBtnText: { color: "#FFF", fontWeight: "700", fontSize: wp("3.6%") },

  statsCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    marginBottom: 20,
  },
  statItem: { alignItems: "center", flex: 1 },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  statValue: { fontWeight: "700", fontSize: wp("4.2%") },
  statLabel: { color: "#555", fontSize: wp("3.2%") },

  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: "center",
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#EAF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  actionLabel: { fontWeight: "600", color: "#111", fontSize: wp("3.2%") },

  invitedCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: { fontWeight: "700", fontSize: wp("4.2%"), marginBottom: 12 },
  invitedItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomColor: "#EEE",
    borderBottomWidth: 1,
  },
  invitedLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarTxt: { color: "#FFF", fontWeight: "700" },
  invitedName: { fontWeight: "600", fontSize: wp("3.6%"), color: "#111" },
  invitedMail: { color: "#777", fontSize: wp("3%") },
  invitedReward: { color: "#4CAF50", fontWeight: "700" },
  moreBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    gap: 6,
  },
  moreTxt: { color: "#007AFF", fontWeight: "600" },

  emptyBox: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
    padding: 24,
    borderRadius: 20,
  },
  emptyImg: { width: wp("60%"), height: hp("20%"), marginBottom: 12 },
  emptyTitle: { fontWeight: "700", fontSize: wp("4.3%"), color: "#111" },
  emptyDesc: { textAlign: "center", color: "#777", fontSize: wp("3.4%"), marginTop: 6 },
});

export default ReferralScreen;
