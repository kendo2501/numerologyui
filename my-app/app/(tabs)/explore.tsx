import React, { useState, useEffect } from 'react';
import {
  StyleSheet, View, Text, TextInput, ImageBackground, TouchableOpacity,
  Dimensions, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform, ScrollView, Alert, ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { useUserData } from '../../context/userDataContext'; // Import hook

const { width } = Dimensions.get('window');

export default function InfoFormScreen() {
  const router = useRouter();
  const { saveUserData, isLoading, fullName: initialName, day: initialDay, month: initialMonth, year: initialYear, clearUserData } = useUserData(); // Lấy hàm save và dữ liệu ban đầu (nếu có)

  const [fullName, setFullName] = useState(initialName || '');
  const [day, setDay] = useState(initialDay || '');
  const [month, setMonth] = useState(initialMonth || '');
  const [year, setYear] = useState(initialYear || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

   // Cập nhật state form nếu dữ liệu trong context thay đổi (ví dụ: sau khi clear)
   useEffect(() => {
      setFullName(initialName || '');
      setDay(initialDay || '');
      setMonth(initialMonth || '');
      setYear(initialYear || '');
   }, [initialName, initialDay, initialMonth, initialYear]);

  const handleNameChange = (text: string) => {
    const sanitized = text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z\s]/g, "");
    setFullName(sanitized); // Không cần toUpperCase ở đây vì sẽ làm trong saveUserData
  };

   const clearInput = (setter: React.Dispatch<React.SetStateAction<string>>) => {
       setter('');
   };

  const isValidDate = (d: string, m: string, y: string): boolean => {
      // ... (hàm kiểm tra ngày như cũ)
      const dayInt = parseInt(d, 10);
      const monthInt = parseInt(m, 10);
      const yearInt = parseInt(y, 10);
      if (isNaN(dayInt) || isNaN(monthInt) || isNaN(yearInt)) return false;
      if (monthInt < 1 || monthInt > 12 || dayInt < 1 || yearInt < 1900 || yearInt > new Date().getFullYear() + 1) return false;
      const date = new Date(yearInt, monthInt - 1, dayInt);
      return (date.getFullYear() === yearInt && date.getMonth() === monthInt - 1 && date.getDate() === dayInt);
  };


  const handleSubmit = async () => {
    if (!fullName.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập họ và tên.'); return;
    }
     if (!day || !month || !year) {
       Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ ngày, tháng, năm sinh.'); return;
     }
     if (!isValidDate(day, month, year)) {
        Alert.alert('Lỗi', 'Ngày sinh không hợp lệ. Vui lòng kiểm tra lại.'); return;
     }

    setIsSubmitting(true);
    try {
      // Lưu dữ liệu dùng context
      await saveUserData({ fullName, day, month, year });
      // Điều hướng sang trang grid
      router.push('index.ts');
    } catch (error) {
        Alert.alert('Lỗi', 'Không thể lưu dữ liệu. Vui lòng thử lại.');
        console.error("Submit error:", error);
    } finally {
        setIsSubmitting(false);
    }
  };

   const handleClearAndRestart = async () => {
       Alert.alert(
           "Xác nhận",
           "Bạn có chắc muốn xóa thông tin đã lưu và nhập lại?",
           [
               { text: "Hủy", style: "cancel" },
               {
                   text: "Đồng ý", onPress: async () => {
                       await clearUserData(); // Xóa dữ liệu trong context và storage
                       // State sẽ tự cập nhật nhờ useEffect
                   }
               }
           ]
       );
   };


  if (isLoading) {
      // Hiển thị màn hình loading khi đang tải dữ liệu từ AsyncStorage
      return (
          <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#fff" />
          </View>
      );
  }

  return (
    <ImageBackground
      source={require('../../assets/images/background.jpg')} // Đảm bảo đường dẫn đúng
      style={styles.background}
      resizeMode="cover"
    >
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoidingContainer}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.scrollContainerForm}>
            <View style={styles.formContainer}>
               {/* --- Ô nhập Họ và Tên --- */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="HỌ VÀ TÊN (KHÔNG DẤU)"
                        placeholderTextColor="#aaa"
                        value={fullName}
                        onChangeText={handleNameChange}
                        autoCapitalize="characters"
                        returnKeyType="next"
                        editable={!isSubmitting} // Không cho sửa khi đang submit
                    />
                    {fullName.length > 0 && !isSubmitting && (
                        <TouchableOpacity onPress={() => clearInput(setFullName)} style={styles.clearButton}>
                        <Text style={styles.clearButtonText}>×</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* --- Hàng nhập Ngày/Tháng/Năm --- */}
                <View style={styles.dateRow}>
                    {/* Ô nhập Ngày (dd) */}
                    <View style={[styles.inputContainer, styles.dateInputContainer, { flex: 2 }]}>
                        <TextInput style={styles.input} placeholder="DD" placeholderTextColor="#aaa" value={day} onChangeText={setDay} keyboardType="number-pad" maxLength={2} returnKeyType="next" editable={!isSubmitting}/>
                        {day.length > 0 && !isSubmitting && (<TouchableOpacity onPress={() => clearInput(setDay)} style={styles.clearButton}><Text style={styles.clearButtonText}>×</Text></TouchableOpacity>)}
                    </View>
                    {/* Ô nhập Tháng (mm) */}
                    <View style={[styles.inputContainer, styles.dateInputContainer, { flex: 2 }]}>
                        <TextInput style={styles.input} placeholder="MM" placeholderTextColor="#aaa" value={month} onChangeText={setMonth} keyboardType="number-pad" maxLength={2} returnKeyType="next" editable={!isSubmitting}/>
                        {month.length > 0 && !isSubmitting && (<TouchableOpacity onPress={() => clearInput(setMonth)} style={styles.clearButton}><Text style={styles.clearButtonText}>×</Text></TouchableOpacity>)}
                    </View>
                    {/* Ô nhập Năm (yyyy) */}
                    <View style={[styles.inputContainer, styles.dateInputContainer, { flex: 3 }]}>
                        <TextInput style={styles.input} placeholder="YYYY" placeholderTextColor="#aaa" value={year} onChangeText={setYear} keyboardType="number-pad" maxLength={4} returnKeyType="done" onSubmitEditing={handleSubmit} editable={!isSubmitting}/>
                        {year.length > 0 && !isSubmitting && (<TouchableOpacity onPress={() => clearInput(setYear)} style={styles.clearButton}><Text style={styles.clearButtonText}>×</Text></TouchableOpacity>)}
                    </View>
                </View>

                 {/* --- Nút Submit --- */}
                <TouchableOpacity style={[styles.submitButton, isSubmitting && styles.submittingButton]} onPress={handleSubmit} disabled={isSubmitting}>
                     {isSubmitting ? (
                         <ActivityIndicator color="#fff" />
                     ) : (
                         <Text style={styles.submitButtonText}>Xem Kết Quả</Text>
                     )}
                </TouchableOpacity>

                 {/* Nút xóa dữ liệu cũ */}
                 {(initialName || initialDay || initialMonth || initialYear) && !isSubmitting && (
                     <TouchableOpacity style={styles.clearOldDataButton} onPress={handleClearAndRestart}>
                         <Text style={styles.clearOldDataButtonText}>Nhập lại từ đầu</Text>
                     </TouchableOpacity>
                 )}
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

// --- Styles --- (Sử dụng styles tương tự như trước, thêm loadingContainer, submittingButton, clearOldDataButton)
const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#333', // Màu nền tối khi loading
    },
    background: { flex: 1, width: '100%', height: '100%' },
    keyboardAvoidingContainer: { flex: 1 },
    scrollContainerForm: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 50, paddingHorizontal: 15 },
    formContainer: { width: '100%', maxWidth: 500, padding: 20, alignItems: 'center' },
    inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 25, marginBottom: 15, width: '100%', paddingHorizontal: 15, height: 50, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.20, shadowRadius: 1.41, elevation: 2 },
    input: { flex: 1, height: '100%', color: 'black', fontSize: 14, fontWeight: '500' },
    clearButton: { padding: 5, marginLeft: 5 },
    clearButtonText: { fontSize: 20, color: '#888', fontWeight: 'bold' },
    dateRow: { flexDirection: 'row', width: '100%', marginBottom: 15, gap: 10 },
    dateInputContainer: { paddingHorizontal: 10, width: undefined, marginBottom: 0 },
    submitButton: { backgroundColor: '#4a3780', borderRadius: 8, paddingVertical: 15, paddingHorizontal: 20, width: '100%', alignItems: 'center', marginTop: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5, minHeight: 50, justifyContent: 'center' },
    submittingButton: { backgroundColor: '#888' }, // Màu xám khi đang submit
    submitButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold', textTransform: 'uppercase' },
    clearOldDataButton: {
        marginTop: 15,
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    clearOldDataButtonText: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 14,
        textDecorationLine: 'underline',
    },
});