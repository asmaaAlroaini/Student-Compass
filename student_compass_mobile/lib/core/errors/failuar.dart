import 'package:dio/dio.dart';
import 'package:flutter/widgets.dart';
import 'package:student_compass_mobile/generated/l10n.dart';

abstract class Failure {
  final String errorMessage;
  final String? errorKey;

  Failure(this.errorMessage, {this.errorKey});

  static String localizedMessage(
    BuildContext context, {
    required String errorMessage,
    String? errorKey,
  }) {
    final translations = S.of(context);

    return switch (errorKey) {
      'ConnectionTimeout' => translations.ConnectionTimeout,
      'SendTimeout' => translations.SendTimeout,
      'ReceiveTimeout' => translations.ReceiveTimeout,
      'BadCertificate' => translations.BadCertificate,
      'RequestCanceled' => translations.RequestCanceled,
      'NoInternetConnection' => translations.NoInternetConnection,
      'UnknownError' => translations.UnknownError,
      'UnauthorizedRequest' => translations.UnauthorizedRequest,
      'MethodNotFound' => translations.MethodNotFound,
      'InternalServerError' => translations.InternalServerError,
      'OopsError' => translations.OopsError,
      _ => errorMessage,
    };
  }
}

class ServerFailure extends Failure {
  ServerFailure(super.errorMessage, {super.errorKey});

  factory ServerFailure.fromDioException(DioException dioException) {
    switch (dioException.type) {
      case DioExceptionType.connectionTimeout:
        return ServerFailure(
          'Connection timeout with ApiServer',
          errorKey: 'ConnectionTimeout',
        );

      case DioExceptionType.sendTimeout:
        return ServerFailure(
          'Send timeout with ApiServer',
          errorKey: 'SendTimeout',
        );

      case DioExceptionType.receiveTimeout:
        return ServerFailure(
          'Receive timeout with ApiServer',
          errorKey: 'ReceiveTimeout',
        );

      case DioExceptionType.badCertificate:
        return ServerFailure(
          'Bad certificate',
          errorKey: 'BadCertificate',
        );

      case DioExceptionType.badResponse:
        return ServerFailure.fromResponse(
          dioException.response!.statusCode!,
          dioException.response!.data,
        );

      case DioExceptionType.cancel:
        return ServerFailure(
          'Request to ApiServer was canceled',
          errorKey: 'RequestCanceled',
        );

      case DioExceptionType.connectionError:
        return ServerFailure(
          'No Internet connection',
          errorKey: 'NoInternetConnection',
        );

      case DioExceptionType.unknown:
      default:
        return ServerFailure(
          'Unknown error, something went wrong , please try again later',
          errorKey: 'UnknownError',
        );
    }
  }

  factory ServerFailure.fromResponse(int statusCode, dynamic response) {
    // معالجة Laravel Validation Errors
    if (response is Map && response['errors'] != null) {
      final errors = StringBuffer();

      response['errors'].forEach((key, value) {
        if (value is List) {
          for (var msg in value) {
            errors.writeln(msg);
          }
        } else {
          errors.writeln(value.toString());
        }
      });

      return ServerFailure(errors.toString());
    }

    if (response is Map) {
      final backendMessage = response['error'] ?? response['message'];
      if (backendMessage != null) {
        return ServerFailure(backendMessage.toString());
      }
    }

    // Errors without a backend message
    if (statusCode == 400 || statusCode == 401 || statusCode == 403) {
      return ServerFailure(
        'Unauthorized request',
        errorKey: 'UnauthorizedRequest',
      );
    }

    if (statusCode == 404) {
      return ServerFailure(
        'Method Not Found , please try again',
        errorKey: 'MethodNotFound',
      );
    }

    if (statusCode == 500) {
      return ServerFailure(
        'Internal Server Error , please try again later',
        errorKey: 'InternalServerError',
      );
    }

    return ServerFailure(
      'Oops, There is an error , please try again later',
      errorKey: 'OopsError',
    );
  }
}
