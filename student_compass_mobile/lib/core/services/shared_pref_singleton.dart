import 'dart:convert';

import 'package:shared_preferences/shared_preferences.dart';
import 'package:student_compass_mobile/Features/Auth/data/models/user/user.dart';

class Prefs {
  static late SharedPreferences inistance;

  static Future<void> init() async {
    inistance = await SharedPreferences.getInstance();
  }

  static void setBool(String key, bool value) {
    inistance.setBool(key, value);
  }

  static bool getBool(String key) {
    return inistance.getBool(key) ?? false;
  }

  static void removeBool(String key) {
    inistance.remove(key);
  }

  static void setString(String key, String value) {
    inistance.setString(key, value);
  }

  static String? getString(String key) {
    return inistance.getString(key);
  }

  static void removeString(String key) {
    inistance.remove(key);
  }

  static void setInt(String key, int value) {
    inistance.setInt(key, value);
  }

  static int getInt(String key) {
    return inistance.getInt(key) ?? 0;
  }

  static void removeInt(String key) {
    inistance.remove(key);
  }

  static void setUser(String key, User value) {
    final String jsonUser = jsonEncode(value.toJson());
    inistance.setString(key, jsonUser);
  }

  static User? getUser(String key) {
    final String? jsonString = inistance.getString(key);

    if (jsonString == null) return null;

    try {
      final Map<String, dynamic> jsonMap = jsonDecode(jsonString);
      return User.fromJson(jsonMap);
    } catch (_) {
      return null;
    }
  }

  static void removeUser(String key) {
    inistance.remove(key);
  }

  static bool contains(String key) {
    return inistance.containsKey(key);
  }

  static void clear() {
    inistance.clear();
  }
}
