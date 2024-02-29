package com.bucketservice.service.utils;

import java.net.URI;
import java.net.URISyntaxException;

public class UrlManipulation {
  public static String removehost(String originalUrl) throws URISyntaxException {
    URI uri = new URI(originalUrl);
    String path = uri.getPath();
    String query = uri.getQuery();

    // Constructing the new URL without the base part
    return path + "?" + query;
  }
}
