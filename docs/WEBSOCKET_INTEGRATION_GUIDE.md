# 🔌 WebSocket Integration Guide - GreenEduMapApp

## ✅ Tích hợp hoàn tất

WebSocket đã được tích hợp thành công vào GreenEduMapApp với các thành phần sau:

### 📦 Các file đã tạo/cập nhật:

1. **src/config/env.ts** - Cấu hình WebSocket
2. **src/services/websocket.ts** - WebSocket Service
3. **src/services/notificationService.ts** - Notification API Service
4. **src/contexts/WebSocketContext.tsx** - WebSocket Context & Provider
5. **src/hooks/useNotifications.ts** - Notifications Hook
6. **src/component/NotificationBanner.tsx** - Notification Toast Banner
7. **App.tsx** - Tích hợp WebSocketProvider

---

## 🎯 Cấu hình

### Environment Variables (src/config/env.ts)

```typescript
REVERB_APP_ID: 808212,
REVERB_APP_KEY: 'mgo7rulpwxlwtslgbr4k',
REVERB_APP_SECRET: 'yh8dts6nhxqzn2i77yim',
REVERB_HOST: 'mimo.dragonlab.vn',
REVERB_PORT: 443, // Nginx reverse proxy
REVERB_SCHEME: 'https',
ENABLE_WEBSOCKET: true,
```

⚠️ **Lưu ý**: Đảm bảo backend Laravel Reverb đang chạy và Nginx đã cấu hình reverse proxy `/app/` → `localhost:6001`

---

## 📖 Cách sử dụng

### 1. Hiển thị Unread Count Badge

Trong bất kỳ screen nào (ví dụ: HomeScreen, NotificationsScreen):

```typescript
import { useNotifications } from '../hooks/useNotifications';

const YourScreen = () => {
  const { unreadCount } = useNotifications();

  return (
    <View>
      <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
        <Icon name="bell" size={24} />
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    right: -6,
    top: -6,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
```

### 2. Auto Refresh khi nhận WebSocket Event

Đăng ký callback để refresh data khi có event mới:

```typescript
import { useNotifications } from '../hooks/useNotifications';

const HomeScreen = () => {
  const { registerRefreshCallback } = useNotifications();

  useEffect(() => {
    // Register callback để refresh data khi có event mới
    const unregister = registerRefreshCallback(() => {
      console.log('🔄 Refreshing data due to WebSocket event');
      fetchData();
      refreshMap();
    });

    return () => unregister();
  }, [registerRefreshCallback]);
};
```

### 3. Hiển thị danh sách Notifications

```typescript
import { useNotifications } from '../hooks/useNotifications';

const NotificationsScreen = () => {
  const { notifications, markAsRead, markAllAsRead, clearAll } = useNotifications();

  return (
    <View>
      <TouchableOpacity onPress={markAllAsRead}>
        <Text>Đánh dấu tất cả đã đọc</Text>
      </TouchableOpacity>

      <FlatList
        data={notifications}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => markAsRead(item.id)}>
            <View style={[styles.item, item.read && styles.itemRead]}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.message}>{item.message}</Text>
              <Text style={styles.time}>
                {new Date(item.timestamp).toLocaleString('vi-VN')}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};
```

---

## 🎨 Notification Types

WebSocket hỗ trợ 4 loại thông báo:

### 1. Environmental Alert (Cảnh báo môi trường)
```typescript
type: 'environmental_alert'
event: 'environmental.alert'
```
- Màu vàng (#FFF3CD)
- Icon: `alert-circle-outline`
- Dùng cho: Cảnh báo chất lượng không khí, nhiệt độ, độ ẩm bất thường

### 2. Learning Update (Cập nhật học tập)
```typescript
type: 'learning_update'
event: 'learning.update'
```
- Màu xanh dương nhạt (#D1ECF1)
- Icon: `book-open-variant`
- Dùng cho: Khóa học mới, bài giảng mới, nội dung học tập cập nhật

### 3. Community Update (Cập nhật cộng đồng)
```typescript
type: 'community_update'
event: 'community.update'
```
- Màu xanh lá nhạt (#D4EDDA)
- Icon: `account-group`
- Dùng cho: Hoạt động cộng đồng, thảo luận mới, sự kiện

### 4. System Message (Thông báo hệ thống)
```typescript
type: 'system_message'
event: 'system.message'
```
- Màu xám nhạt (#E2E3E5)
- Icon: `information-outline`
- Dùng cho: Bảo trì, cập nhật hệ thống, thông báo chung

---

## 🔧 Backend Event Structure

### Laravel Event Class Example:

```php
<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class EnvironmentalAlert implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $userId;
    public $alertData;

    public function __construct($userId, $alertData)
    {
        $this->userId = $userId;
        $this->alertData = $alertData;
    }

    public function broadcastOn()
    {
        return new PrivateChannel('user.' . $this->userId);
    }

    public function broadcastAs()
    {
        return 'environmental.alert';
    }

    public function broadcastWith()
    {
        return [
            'id' => $this->alertData['id'],
            'message' => $this->alertData['message'],
            'location' => $this->alertData['location'],
            'severity' => $this->alertData['severity'],
            'aqi_value' => $this->alertData['aqi_value'],
        ];
    }
}
```

### Trigger Event từ Backend:

```php
// Trong Controller hoặc Job
event(new EnvironmentalAlert($userId, [
    'id' => 123,
    'message' => 'Chất lượng không khí ở Đà Nẵng đang ở mức nguy hại',
    'location' => 'Đà Nẵng',
    'severity' => 'high',
    'aqi_value' => 156,
]));
```

---

## ✅ Testing

### 1. Kiểm tra Connection

Reload app và xem logs trong React Native Debugger hoặc Metro:

```
🚀 Initializing WebSocket...
🔑 Token found: 6|dZE5leKP...
✅ Laravel Echo created successfully
🚀 Pusher instance obtained
✅ WebSocket connected
🎯 Setting up WebSocket listeners for user: 1
📡 Subscribing to private-user.1...
✅ Subscribed to private-user.1
```

### 2. Test Event từ Backend

Từ Laravel Tinker hoặc backend test:

```php
php artisan tinker

// Test environmental alert
event(new \App\Events\EnvironmentalAlert(1, [
    'id' => 123,
    'message' => 'Chất lượng không khí ở Đà Nẵng đang ở mức nguy hại',
    'location' => 'Đà Nẵng',
    'severity' => 'high',
    'aqi_value' => 156,
]));
```

### 3. Kiểm tra Mobile Logs:

```
🌍 Environmental alert: { id: 123, message: '...', ... }
✅ Notification created
📊 Unread count from API: 1
🔄 Refreshing data due to WebSocket event
```

### 4. Kiểm tra UI:

- ✅ Toast notification xuất hiện
- ✅ Unread badge cập nhật
- ✅ Auto refresh hoạt động
- ✅ Progress bar chạy trong 5s
- ✅ Notification tự động ẩn sau 5s

---

## 🐛 Troubleshooting

### Không kết nối được WebSocket

**Kiểm tra:**
1. Backend Laravel Reverb đang chạy: `php artisan reverb:start`
2. Nginx reverse proxy đã cấu hình
3. Token authentication đang hoạt động
4. ENABLE_WEBSOCKET = true trong env.ts

**Debug:**
```typescript
// Trong WebSocketService
console.log('Connection config:', getEchoConfig());
console.log('Token:', await AsyncStorage.getItem('@auth_token'));
```

### Không nhận được Events

**Kiểm tra:**
1. Channel name đúng format: `private-user.{userId}`
2. Event name khớp với backend: `environmental.alert`
3. User đã đăng nhập và có userId
4. Backend đã trigger event đúng

**Debug:**
```typescript
// Thêm global event listener trong WebSocketService
this.pusher.connection.bind_global((eventName, data) => {
  console.log('🌍 Global event:', eventName, data);
});
```

### Banner không hiển thị

**Kiểm tra:**
1. NotificationBanner phải nằm BÊN TRONG WebSocketProvider
2. z-index đủ cao (999999)
3. SafeAreaProvider được wrap bên ngoài

---

## 🚀 Production Checklist

- [ ] Backend Laravel Reverb running và stable
- [ ] Nginx reverse proxy configured và tested
- [ ] SSL certificates valid
- [ ] `/broadcasting/auth` endpoint secured
- [ ] Events broadcast correctly với production data
- [ ] Mobile app connects thành công
- [ ] Notifications display đúng cho tất cả types
- [ ] Auto-refresh working với real data
- [ ] Navigation working từ notifications
- [ ] Error handling implemented đầy đủ
- [ ] Connection status indicator (optional)
- [ ] Testing trên cả iOS và Android
- [ ] Performance testing với nhiều events
- [ ] Battery usage acceptable

---

## 📚 API Endpoints

Backend cần implement các endpoints sau:

### 1. Get Unread Count
```
GET /notifications/unread-count
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "count": 5
  }
}
```

### 2. Get Notifications
```
GET /notifications?page=1&per_page=20
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "data": [...],
    "total": 25,
    "current_page": 1,
    "per_page": 20
  }
}
```

### 3. Mark as Read
```
POST /notifications/{id}/read
Authorization: Bearer {token}

Response:
{
  "success": true
}
```

### 4. Mark All as Read
```
POST /notifications/read-all
Authorization: Bearer {token}

Response:
{
  "success": true
}
```

### 5. Broadcasting Auth
```
POST /broadcasting/auth
Authorization: Bearer {token}

Request:
{
  "socket_id": "123.456",
  "channel_name": "private-user.1"
}

Response:
{
  "auth": "hash_string"
}
```

---

## ✨ Features

✅ **Real-time Notifications** - Nhận thông báo ngay lập tức
✅ **Auto Refresh** - Tự động cập nhật data khi có event mới
✅ **Toast Banner** - Hiển thị thông báo đẹp mắt với animation
✅ **Unread Count** - Đếm số thông báo chưa đọc
✅ **Type-based Styling** - Màu sắc khác nhau theo loại thông báo
✅ **Offline Support** - Xử lý khi mất kết nối
✅ **Token Authentication** - Bảo mật với Bearer token
✅ **Private Channels** - Chỉ user được nhận thông báo của mình

---

**✅ HOÀN THÀNH!** WebSocket đã sẵn sàng sử dụng! 🎉
