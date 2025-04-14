import React, { useState } from 'react'; // 1. Import useState
import { StyleSheet, View, Text, ImageBackground, TouchableOpacity, Dimensions, Button, ActivityIndicator, ScrollView } from 'react-native';
// import { useRouter, Link } from 'expo-router'; // Không dùng useRouter và Link nữa
import { useUserData } from '../../context/userDataContext'; // Vẫn dùng hook context

// --- Placeholder Imports: Thay thế bằng đường dẫn thực tế của bạn ---
// 2. Import trực tiếp các component UI của bạn
// Ví dụ (bạn cần thay thế bằng import thật):

 // Bỏ comment và thay thế nếu bạn có các component này
import MainNumberScreen from '../../ui/main.number';
import BirthChartScreen from '../../ui/birth.chart';
import NameChartScreen from '../../ui/name.chart';
import SummaryChartScreen from '../../ui/summary.chart';
import TrendArrowScreen from '../../ui/trend.arrow';
import PyramidPeakScreen from '../../ui/pyramid.nail';
import PersonalYearScreen from '../../ui/personal.year';
import MandalaScreen from '../../ui/mandala/mandala';

// --- Kết thúc Placeholder Imports ---

const { width } = Dimensions.get('window');
const buttonSize = width * 0.25;
const buttonMargin = width * 0.02;

// 4. Cập nhật buttonsData với 'viewId'
const buttonsData = [
  { text: 'SỐ CHỦ ĐẠO', viewId: 'main-number' },
  { text: 'BIỂU ĐỒ NGÀY SINH', viewId: 'birth-chart' },
  { text: 'BIỂU ĐỒ TÊN', viewId: 'name-chart' },
  { text: 'BIỂU ĐỒ TỔNG HỢP', viewId: 'summary-chart' },
  { text: 'TÊN XU HƯỚNG', viewId: 'trend-arrow' },
  { text: 'ĐỈNH KIM TỰ', viewId: 'pyramid-peak' },
  { text: 'PERSONAL YEAR', viewId: 'personal-year' },
  { text: 'MANDALA', viewId: 'mandala' },

];

// Kiểu dữ liệu cho viewId, bao gồm cả trạng thái hiển thị grid
type ActiveView = typeof buttonsData[number]['viewId'] | 'grid';

export default function FunctionGridScreen() {
  // const router = useRouter(); // Không cần nữa trừ khi cần cho nút "Sửa thông tin" để quay lại màn hình trước đó
  const { fullName, day, month, year, isLoading, clearUserData } = useUserData(); // Lấy dữ liệu từ context

  // 3. Tạo state để quản lý view hiện tại, mặc định là 'grid'
  const [activeView, setActiveView] = useState<ActiveView>('grid');

  if (isLoading) {
    // Hiển thị loading nếu context đang tải dữ liệu ban đầu
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  // Nếu chưa có dữ liệu (vẫn cần kiểm tra này)
  if (!fullName || !day || !month || !year) {
      return (
          <View style={styles.centeredMessage}>
              <Text style={styles.messageText}>Vui lòng nhập thông tin trước.</Text>
              {/* Nút này cần logic điều hướng riêng */}
              <Button title="Nhập thông tin" onPress={() => console.log("Cần điều hướng về form")} />
          </View>
      );
  }

  // Hàm để render nội dung dựa trên activeView
  const renderContent = () => {
    // 9. Truyền props chứa dữ liệu người dùng xuống component con
    const userDataProps = { fullName, day, month, year };

    switch (activeView) {
      case 'main-number':
        return <MainNumberScreen {...userDataProps} />;
      case 'birth-chart':
        return <BirthChartScreen {...userDataProps} />;
      case 'name-chart':
        return <NameChartScreen {...userDataProps} />;
    
      case 'summary-chart':
         return <SummaryChartScreen {...userDataProps} />;
      case 'trend-arrow':
         return <TrendArrowScreen {...userDataProps} />;
      case 'pyramid-peak':
         return <PyramidPeakScreen {...userDataProps} />;
      case 'personal-year':
         return <PersonalYearScreen {...userDataProps} />;
      case 'mandala':
         return <MandalaScreen {...userDataProps} />;
      
      
      case 'grid':
      default:
        return (
          <ImageBackground
            source={require('../../assets/images/background.jpg')} // Đường dẫn ảnh nền
            style={styles.backgroundGrid}
            resizeMode="cover"
          >
            <ScrollView contentContainerStyle={styles.overlay}>
              <Text style={styles.displayName}>Họ tên: {fullName}</Text>
              <Text style={styles.displayName}>Ngày sinh: {day}/{month}/{year}</Text>

              <View style={styles.gridContainer}>
                {buttonsData.map((buttonInfo) => (
                  <TouchableOpacity
                    key={buttonInfo.viewId}
                    style={styles.button}
                    onPress={() => setActiveView(buttonInfo.viewId)}
                  >
                    <Text style={styles.buttonText}>{buttonInfo.text}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Nút để quay lại Grid hoặc sửa thông tin (cần logic phù hợp) */}
              <TouchableOpacity onPress={() => console.log("Cần điều hướng về form hoặc xóa dữ liệu")} style={styles.backToFormButton}>
                 <Text style={styles.backToFormButtonText}>Sửa thông tin</Text>
              </TouchableOpacity>

            </ScrollView>
          </ImageBackground>
        );
    }
  };

  // Hàm để quay lại grid
  const handleBackToGrid = () => {
    setActiveView('grid');
  };

  return (
    <View style={styles.container}>
      {/* Render nội dung chính */}
      {renderContent()}

      {/* Nút Back chỉ hiển thị khi không ở màn hình grid */}
      {activeView !== 'grid' && (
         <View style={styles.backButtonContainer}>
           <Button title="< Quay lại Grid" onPress={handleBackToGrid} color="#333" />
         </View>
      )}
    </View>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#f0f0f0', // Thêm màu nền cho container chính nếu cần
  },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#333' },
  centeredMessage: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#f0f0f0' },
  messageText: { fontSize: 18, textAlign: 'center', marginBottom: 20, color: '#333' },
  backgroundGrid: { flex: 1, width: '100%', height: '100%' },
  overlay: { flexGrow: 1, backgroundColor: 'rgba(0, 0, 0, 0.4)', justifyContent: 'center', alignItems: 'center', paddingVertical: 40, paddingHorizontal: 10 },
  displayName: { fontSize: 16, fontWeight: 'bold', color: 'white', marginBottom: 8, textAlign: 'center' },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', maxWidth: (buttonSize + buttonMargin * 2) * 3, marginTop: 20 },
  button: { width: buttonSize, height: buttonSize, backgroundColor: 'white', borderRadius: 8, margin: buttonMargin, justifyContent: 'center', alignItems: 'center', padding: 5, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 },
  buttonText: { color: 'black', fontWeight: 'bold', textAlign: 'center', fontSize: 12 },
  backToFormButton: { marginTop: 30, paddingVertical: 10, paddingHorizontal: 20, backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: 20 },
  backToFormButtonText: { color: '#333', fontSize: 14, fontWeight: 'bold' },
  backButtonContainer: {
     position: 'absolute',
     top: 50, // Điều chỉnh dựa trên StatusBar/Header
     left: 15,
     zIndex: 10,
     backgroundColor: 'rgba(255, 255, 255, 0.8)',
     borderRadius: 5,
     paddingHorizontal: 0, // Chỉnh padding cho Button bên trong
     paddingVertical: 0, // Chỉnh padding cho Button bên trong
     shadowColor: "#000",
     shadowOffset: { width: 0, height: 1 },
     shadowOpacity: 0.22,
     shadowRadius: 2.22,
     elevation: 3,
  },
  // Style ví dụ cho các view chi tiết (để chúng có nền và padding)
  detailView: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff', // Màu nền cho các màn hình chi tiết
    alignItems: 'center',
    justifyContent: 'center'
  }
});