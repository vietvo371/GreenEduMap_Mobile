import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions,
  ScrollView,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";

export interface ReferralDetailBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  totalVnd: number;
  receivedVnd: number;
  availableVnd: number;
  pendingVnd: number;
  invitedCount: number;
  commissionData: any[];
  invitedUsers: any[];
  onWithdraw?: () => void;
  mode?: "history" | "invited" | "withdraw";
}

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const ReferralDetailBottomSheet: React.FC<ReferralDetailBottomSheetProps> = ({
  visible,
  onClose,
  totalVnd,
  receivedVnd,
  availableVnd,
  pendingVnd,
  invitedCount,
  commissionData,
  invitedUsers,
  onWithdraw,
  mode = "withdraw",
}) => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [slideAnim] = useState(new Animated.Value(SCREEN_HEIGHT));
  const [openId, setOpenId] = useState<number>(0);

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

  const currentMode = mode;
  const sheetTitle =
    currentMode === "withdraw"
      ? "Rút tiền"
      : currentMode === "history"
      ? "Lịch sử giao dịch"
      : "Danh sách bạn bè";

  const renderEmptyState = (title: string, description: string) => (
    <View style={styles.emptyState}>
      <Image 
        source={require('../assets/images/Questions-rafiki.png')} 
        style={styles.emptyStateImage}
        resizeMode="contain"
      />
      <Text style={styles.emptyStateTitle}>{title}</Text>
      <Text style={styles.emptyStateDesc}>{description}</Text>
    </View>
  );

  const renderInvitedList = () => (
    <View style={styles.invitedUsersList}>
      {invitedUsers.map((user, index) => {
        const initial =
          typeof user?.full_name === "string" && user.full_name.length > 0
            ? user.full_name.charAt(0).toUpperCase()
            : user?.email?.charAt(0)?.toUpperCase() ?? "?";

        return (
          <View key={index} style={styles.invitedUserItem}>
            <View style={styles.invitedUserLeft}>
              <View style={styles.invitedUserAvatar}>
                <Text style={styles.invitedUserInitial}>{initial}</Text>
              </View>
              <View style={styles.invitedUserInfo}>
                <Text style={styles.invitedUserName}>{user.full_name}</Text>
                <Text style={styles.invitedUserEmail}>{user.email}</Text>
              </View>
            </View>
            <View style={styles.invitedUserRight}>
              {user.tong_hoa_hong > 0 ? (
                <Text style={styles.invitedUserCommission}>+{formatVndAmount(user.tong_hoa_hong)}</Text>
              ) : (
                <Text style={styles.invitedUserCommission}>+0 đ</Text>
              )}
              <Text style={styles.invitedUserLabel}>Hoa hồng</Text>
            </View>
          </View>
        );
      })}
    </View>
  );

  const renderHistoryList = () => (
    <View style={styles.commissionList}>
      {commissionData.map((item, index) => {
        const isPending = item.tinh_trang === 0;
        const isApproved = item.tinh_trang === 1;
        
        // Truncate TXID if too long
        const truncatedTxid = item.txid && item.txid.length > 20 
          ? `${item.txid.substring(0, 8)}...${item.txid.substring(item.txid.length - 8)}`
          : item.txid || 'N/A';

        return (
          <View key={index} style={styles.commissionItem}>
            <View style={styles.commissionLeft}>
              <View
                style={[
                  styles.commissionIcon,
                  { 
                    backgroundColor: isPending ? "#FFF3E0" : "#E8F5E8",
                    borderWidth: 1,
                    borderColor: isPending ? "#FFE0B2" : "#C8E6C9"
                  },
                ]}
              >
                <Icon
                  name={isPending ? "clock-outline" : "check-circle"}
                  size={18}
                  color={isPending ? "#FF9800" : "#4CAF50"}
                />
              </View>
              <View style={styles.commissionInfo}>
                <Text style={styles.commissionName} numberOfLines={1}>
                  {item.nguoi_thuc_hien || 'N/A'}
                </Text>
                <View style={styles.txidContainer}>
                  <Text style={styles.commissionTxidLabel}>TXID:</Text>
                  <Text style={styles.commissionTxid} numberOfLines={1}>
                    {truncatedTxid}
                  </Text>
                </View>
                <Text style={styles.commissionReceiver} numberOfLines={1}>
                  Người nhận: {item.nguoi_nhan || 'N/A'}
                </Text>
              </View>
            </View>
            <View style={styles.commissionRight}>
              <Text style={styles.commissionAmount}>
                +{formatVndAmount(item.so_hoa_hong || 0)}
              </Text>
              <View style={[
                styles.statusBadge,
                { 
                  backgroundColor: isPending ? "#FFF3E0" : "#E8F5E8",
                  borderColor: isPending ? "#FFE0B2" : "#C8E6C9"
                }
              ]}>
                <Text
                  style={[
                    styles.commissionStatus,
                    { color: isPending ? "#FF9800" : "#4CAF50" },
                  ]}
                >
                  {isPending ? "Đang chờ" : isApproved ? "Đã duyệt" : "Không xác định"}
                </Text>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );

  useEffect(() => {
    if (visible) {
      setOpenId(prev => prev + 1);
      setModalVisible(true);
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 8,
      }).start();
    } else if (modalVisible) {
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 200,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start(() => setModalVisible(false));
    }
  }, [visible]);

  if (!modalVisible) return null;

  return (
    <Modal
      key={`referral-detail-${openId}`}
      visible={modalVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />

        <Animated.View style={[styles.modalContent, { transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.header}>
            <View style={styles.grabber} />
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{sheetTitle}</Text>
              <TouchableOpacity
                onPress={onClose}
                style={styles.closeButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Icon name="close" size={22} color="#8E8E93" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.content}>
            {currentMode === "withdraw" && (
              <>
                <ScrollView
                  style={[styles.scrollContent, { marginTop: 10 }]}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: 24 }}
                >
                  <View style={styles.detailList}>
                    <View style={styles.detailRow}>
                      <View style={styles.detailLeft}>
                        <View style={[styles.detailIcon, { backgroundColor: "#E3F2FD" }]}>
                          <Icon name="trending-up" size={20} color="#007AFF" />
                        </View>
                        <View style={styles.detailText}>
                          <Text style={styles.detailLabel}>Tổng hoa hồng</Text>
                          <Text style={styles.detailDesc}>
                            Tổng số tiền hoa hồng đã kiếm được
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.detailValue}>{formatVndAmount(totalVnd)}</Text>
                    </View>

                    <View style={styles.detailRow}>
                      <View style={styles.detailLeft}>
                        <View style={[styles.detailIcon, { backgroundColor: "#E8F5E8" }]}>
                          <Icon name="check-circle" size={20} color="#4CAF50" />
                        </View>
                        <View style={styles.detailText}>
                          <Text style={styles.detailLabel}>Đã nhận</Text>
                          <Text style={styles.detailDesc}>Số tiền đã rút thành công</Text>
                        </View>
                      </View>
                      <Text style={styles.detailValue}>{formatVndAmount(receivedVnd)}</Text>
                    </View>

                    <View style={styles.detailRow}>
                      <View style={styles.detailLeft}>
                        <View style={[styles.detailIcon, { backgroundColor: "#E8F5E8" }]}>
                          <Icon name="wallet" size={20} color="#4CAF50" />
                        </View>
                        <View style={styles.detailText}>
                          <Text style={styles.detailLabel}>Khả dụng</Text>
                          <Text style={styles.detailDesc}>Số tiền có thể rút ngay</Text>
                        </View>
                      </View>
                      <Text style={[styles.detailValue, { color: "#4CAF50" }]}>
                        {formatVndAmount(availableVnd)}
                      </Text>
                    </View>

                    <View style={styles.detailRow}>
                      <View style={styles.detailLeft}>
                        <View style={[styles.detailIcon, { backgroundColor: "#FFF3E0" }]}>
                          <Icon name="clock-outline" size={20} color="#FF9800" />
                        </View>
                        <View style={styles.detailText}>
                          <Text style={styles.detailLabel}>Đang chờ</Text>
                          <Text style={styles.detailDesc}>Số tiền đang trong quá trình xử lý</Text>
                        </View>
                      </View>
                      <Text style={[styles.detailValue, { color: "#FF9800" }]}>
                        {formatVndAmount(pendingVnd)}
                      </Text>
                    </View>

                    <View style={[styles.detailRow, styles.detailRowLast]}>
                      <View style={styles.detailLeft}>
                        <View style={[styles.detailIcon, { backgroundColor: "#E3F2FD" }]}>
                          <Icon name="account-group" size={20} color="#007AFF" />
                        </View>
                        <View style={styles.detailText}>
                          <Text style={styles.detailLabel}>Số người đã mời</Text>
                          <Text style={styles.detailDesc}>Tổng số người sử dụng mã giới thiệu</Text>
                        </View>
                      </View>
                      <Text style={styles.detailValue}>{invitedCount} người</Text>
                    </View>
                  </View>
                </ScrollView>

                <TouchableOpacity
                  style={[styles.withdrawButton, { opacity: availableVnd <= 0 ? 0.2 : 1 }]}
                  onPress={() => {
                    onClose();
                    // Navigate to CommissionWithdrawScreen instead of WithdrawScreen
                    navigation.navigate('CommissionWithdraw' as never);
                  }}
                  disabled={availableVnd <= 0}
                >
                  <Icon name="bank-transfer-out" size={20} color="#FFF" />
                  <Text style={styles.withdrawText}>Rút tiền ngay</Text>
                </TouchableOpacity>
              </>
            )}

            {currentMode === "invited" && (
              <ScrollView
                style={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 24 }}
              >
                <View style={styles.invitedUsersSection}>
                  {invitedUsers.length > 0
                    ? renderInvitedList()
                    : renderEmptyState(
                        "Chưa có bạn bè",
                        "Chia sẻ liên kết để mời thêm bạn bè và nhận thưởng."
                      )}
                </View>
              </ScrollView>
            )}

            {currentMode === "history" && (
              <ScrollView
                style={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 24 }}
              >
                <View style={styles.commissionHistory}>
                  {commissionData.length > 0
                    ? renderHistoryList()
                    : renderEmptyState(
                        "Chưa có lịch sử",
                        "Các giao dịch hoa hồng sẽ hiển thị khi bạn có hoạt động."
                      )}
                </View>
              </ScrollView>
            )}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  backdrop: { flex: 1 },
  modalContent: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: SCREEN_HEIGHT * 0.7,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    paddingTop: 8,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  grabber: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E5E5EA",
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  title: {
    fontSize: wp("4.5%"),
    fontWeight: "700",
    color: "#1A1A1A",
    textAlign: "center",
    flex: 1,
  },
  closeButton: {
    padding: 6,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  // Summary Card
  summaryCard: {
    backgroundColor: "#F8F9FA",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  summaryGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryItem: {
    alignItems: "center",
    flex: 1,
  },
  summaryValue: {
    fontSize: wp("5%"),
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: wp("3.2%"),
    color: "#666",
    marginBottom: 2,
  },
  summaryUnit: {
    fontSize: wp("2.8%"),
    color: "#999",
    fontWeight: "500",
  },

  // Detail List
  scrollContent: {
    flex: 1,
  },
  detailList: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    paddingHorizontal: 4,
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  detailRowLast: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  detailLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  detailText: {
    flex: 1,
  },
  detailLabel: {
    fontSize: wp("3.8%"),
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 2,
  },
  detailDesc: {
    fontSize: wp("3.2%"),
    color: "#666",
    lineHeight: 16,
  },
  detailValue: {
    fontSize: wp("4%"),
    fontWeight: "700",
    color: "#1A1A1A",
    textAlign: "right",
  },

  // Withdraw Button
  withdrawButton: {
    backgroundColor: "#007AFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 25,
    gap: 10,
    elevation: 3,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  withdrawText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: wp("4%"),
  },

  // Commission History Styles
  commissionHistory: {
    marginBottom: 20,
    marginTop: 20,
  },
  commissionTitle: {
    fontSize: wp("4%"),
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 16,
  },
  commissionList: {
    paddingBottom: 8,
  },
  commissionItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    marginBottom: 8,
    minHeight: 80,
  },
  commissionLeft: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
    gap: 12,
    paddingTop: 2,
  },
  commissionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  commissionInfo: {
    flex: 1,
    marginTop: 2,
  },
  commissionName: {
    fontSize: wp("3.6%"),
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 6,
  },
  txidContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    flexWrap: "wrap",
  },
  commissionTxidLabel: {
    fontSize: wp("2.8%"),
    color: "#666",
    fontWeight: "500",
    marginRight: 4,
  },
  commissionTxid: {
    fontSize: wp("2.8%"),
    color: "#666",
    flex: 1,
    fontFamily: "monospace",
  },
  commissionReceiver: {
    fontSize: wp("2.8%"),
    color: "#999",
    marginTop: 2,
  },
  commissionRight: {
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: "100%",
    paddingTop: 2,
  },
  commissionAmount: {
    fontSize: wp("3.8%"),
    fontWeight: "700",
    color: "#4CAF50",
    marginBottom: 8,
    textAlign: "right",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    minWidth: 70,
    alignItems: "center",
  },
  commissionStatus: {
    fontSize: wp("2.6%"),
    fontWeight: "600",
    textAlign: "center",
  },

  // Invited Users Styles
  invitedUsersSection: {
    marginBottom: 20,
    marginTop: 20,
  },
  invitedUsersTitle: {
    fontSize: wp("4%"),
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 16,
  },
  invitedUsersList: {
    gap: 12,
  },
  invitedUserItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
  },
  invitedUserLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  invitedUserAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#4A90E2",
    alignItems: "center",
    justifyContent: "center",
  },
  invitedUserInitial: {
    fontSize: wp("3.6%"),
    fontWeight: "700",
    color: "#FFF",
  },
  invitedUserInfo: {
    flex: 1,
  },
  invitedUserName: {
    fontSize: wp("3.6%"),
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 2,
  },
  invitedUserEmail: {
    fontSize: wp("3%"),
    color: "#666",
  },
  invitedUserRight: {
    alignItems: "flex-end",
  },
  invitedUserCommission: {
    fontSize: wp("3.8%"),
    fontWeight: "700",
    color: "#4CAF50",
    marginBottom: 2,
  },
  invitedUserLabel: {
    fontSize: wp("3%"),
    color: "#666",
    fontWeight: "500",
  },

  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: "#F4F5F7",
    borderRadius: 12,
    gap: 12,
  },
  emptyStateImage: {
    width: wp("60%"),
    height: wp("40%"),
    marginBottom: 8,
  },
  emptyStateTitle: {
    fontSize: wp("3.4%"),
    fontWeight: "600",
    color: "#1A1A1A",
  },
  emptyStateDesc: {
    fontSize: wp("3%"),
    color: "#666",
    textAlign: "center",
    lineHeight: 16,
  },
});

export default ReferralDetailBottomSheet;

