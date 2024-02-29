package com.bucketservice.service.utils;

import java.util.Map;

public class HttpResponse {
  public static Map<String, Object> respond(boolean success, String message, Map<String, Object> data) {
    return Map.of(
        "success", success,
        "message", message,
        "data", data
    );
  }
}
