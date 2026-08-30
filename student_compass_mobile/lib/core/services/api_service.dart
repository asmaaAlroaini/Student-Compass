import 'dart:developer';
import 'dart:io';

import 'package:dio/dio.dart';
import 'package:student_compass_mobile/core/constants/constants.dart';

class ApiService {
  String get _baseUrl => AppConstants.kBaseUrl;

  void requestInfo({
    required String method,
    required String endPoint,
    required dynamic body,
    required String? token,
    Map<String, String>? headers,
  }) {
    log('''
----------------------------
Method: $method
Url: $_baseUrl/$endPoint
Body: $body
Token: $token
Headers: $headers
''');
  }

  final Dio dio;
  ApiService(this.dio);

  Future<dynamic> get({
    required String endPoint,
    required dynamic body,
    required String? token,
  }) async {
    Map<String, String> headers = {};

    headers.addAll({'Accept': 'application/json'});
    if (token != null) {
      headers.addAll({'Authorization': 'Bearer $token'});
    }

    requestInfo(
      method: 'GET',
      endPoint: endPoint,
      body: body,
      token: token,
      headers: headers,
    );

    var response = await dio.get(
      '$_baseUrl/$endPoint',
      options: Options(headers: headers),
    );
    log('''
========================================
    Response : ${response.data}
========================================
    ''');
    return response.data;
  }

  Future<dynamic> post({
    required String endPoint,
    required dynamic body,
    required String? token,
  }) async {
    final requestBody = await _prepareRequestBody(body);
    final isMultipart = requestBody is FormData;
    Map<String, String> headers = {};

    headers.addAll({
      'Content-Type':
          isMultipart
              ? Headers.multipartFormDataContentType
              : Headers.jsonContentType,
    });
    headers.addAll({'Accept': 'application/json'});
    if (token != null) {
      headers.addAll({'Authorization': 'Bearer $token'});
    }

    requestInfo(
      method: 'POST',
      endPoint: endPoint,
      body: requestBody,
      token: token,
      headers: headers,
    );

    var response = await dio.post(
      '$_baseUrl/$endPoint',
      data: requestBody,
      options: Options(headers: headers),
    );

    log('''
========================================
    Response : ${response.data}
========================================
    ''');

    return response.data;
  }

  Future<dynamic> _prepareRequestBody(dynamic body) async {
    if (!_hasUploadFile(body)) {
      return body;
    }

    final preparedBody = await _prepareMultipartValue(body);
    if (preparedBody is Map<String, dynamic>) {
      return FormData.fromMap(preparedBody);
    }

    return preparedBody;
  }

  bool _hasUploadFile(dynamic value) {
    if (value is File || value is MultipartFile) {
      return true;
    }
    if (value is Map) {
      return value.values.any(_hasUploadFile);
    }
    if (value is Iterable) {
      return value.any(_hasUploadFile);
    }
    return false;
  }

  Future<dynamic> _prepareMultipartValue(dynamic value) async {
    if (value is File) {
      return MultipartFile.fromFile(
        value.path,
        filename: _fileName(value.path),
        contentType: _fileContentType(value.path),
      );
    }
    if (value is Map) {
      final preparedMap = <String, dynamic>{};
      for (final entry in value.entries) {
        preparedMap[entry.key.toString()] = await _prepareMultipartValue(
          entry.value,
        );
      }
      return preparedMap;
    }
    if (value is Iterable) {
      final preparedList = <dynamic>[];
      for (final item in value) {
        preparedList.add(await _prepareMultipartValue(item));
      }
      return preparedList;
    }
    return value;
  }

  String _fileName(String path) {
    final normalizedPath = path.replaceAll('\\', '/');
    final name = normalizedPath.split('/').last;
    final extension = _fileExtension(name);

    if (extension == 'jpeg' ||
        extension == 'jpg' ||
        extension == 'png' ||
        extension == 'gif' ||
        extension == 'pdf') {
      return name;
    }

    return '$name.jpg';
  }

  DioMediaType _fileContentType(String path) {
    final extension = _fileExtension(path);

    return switch (extension) {
      'png' => DioMediaType('image', 'png'),
      'gif' => DioMediaType('image', 'gif'),
      'jpg' || 'jpeg' => DioMediaType('image', 'jpeg'),
      'pdf' => DioMediaType('application', 'pdf'),
      _ => DioMediaType('image', 'jpeg'),
    };
  }

  String _fileExtension(String path) {
    final normalizedPath = path.toLowerCase().split('?').first;
    final dotIndex = normalizedPath.lastIndexOf('.');

    if (dotIndex == -1 || dotIndex == normalizedPath.length - 1) {
      return '';
    }

    return normalizedPath.substring(dotIndex + 1);
  }

  Future<dynamic> put({
    required String endPoint,
    required dynamic body,
    required String? token,
  }) async {
    final requestBody = await _prepareRequestBody(body);
    final isMultipart = requestBody is FormData;
    Map<String, String> headers = {};

    headers.addAll({
      'Content-Type':
          isMultipart
              ? Headers.multipartFormDataContentType
              : Headers.jsonContentType,
    });

    headers.addAll({'Accept': 'application/json'});
    if (token != null) {
      headers.addAll({'Authorization': 'Bearer $token'});
    }

    requestInfo(
      method: 'PUT',
      endPoint: endPoint,
      body: requestBody,
      token: token,
      headers: headers,
    );

    var response = await dio.put(
      '$_baseUrl/$endPoint',
      data: requestBody,
      options: Options(headers: headers),
    );
    return response.data;
  }

  Future<dynamic> delete({
    required String endPoint,
    required String? token,
  }) async {
    Map<String, String> headers = {};

    headers.addAll({'Content-Type': 'application/json'});
    if (token != null) {
      headers.addAll({'Authorization': 'Bearer $token'});
    }

    requestInfo(
      method: 'DELETE',
      endPoint: endPoint,
      body: {},
      token: token,
      headers: headers,
    );

    var response = await dio.delete(
      '$_baseUrl/$endPoint',
      options: Options(headers: headers),
    );

    return response.data;
  }
}
