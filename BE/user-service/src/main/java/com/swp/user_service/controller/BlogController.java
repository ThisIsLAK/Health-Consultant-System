package com.swp.user_service.controller;

import com.swp.user_service.dto.request.BlogRequest;
import com.swp.user_service.dto.response.BlogResponse;
import com.swp.user_service.service.BlogService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/blogs")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BlogController {

    BlogService blogService;

    @PostMapping
    public ResponseEntity<BlogResponse> createBlog(@RequestBody BlogRequest request) {
        BlogResponse createdBlog = blogService.createBlog(request);
        return ResponseEntity.ok(createdBlog);
    }

    @PutMapping("/{blogCode}")
    public ResponseEntity<BlogResponse> updateBlog(@PathVariable String blogCode, @RequestBody BlogRequest request) {
        BlogResponse updatedBlog = blogService.updateBlog(blogCode, request);
        return ResponseEntity.ok(updatedBlog);
    }

    @DeleteMapping("/{blogCode}")
    public ResponseEntity<Void> deleteBlog(@PathVariable String blogCode) {
        blogService.deleteBlog(blogCode);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{blogCode}")
    public ResponseEntity<BlogResponse> getBlogByBlogCode(@PathVariable String blogCode) {
        BlogResponse blog = blogService.getBlogByBlogCode(blogCode);
        return ResponseEntity.ok(blog);
    }

    @GetMapping
    public ResponseEntity<List<BlogResponse>> getAllBlogs() {
        List<BlogResponse> blogs = blogService.getAllBlogs();
        return ResponseEntity.ok(blogs);
    }
}