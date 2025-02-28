package com.swp.user_service.service;

import com.swp.user_service.dto.request.BlogRequest;
import com.swp.user_service.dto.response.BlogResponse;
import com.swp.user_service.entity.Blog;
import com.swp.user_service.exception.AppException;
import com.swp.user_service.exception.ErrorCode;
import com.swp.user_service.mapper.BlogMapper;
import com.swp.user_service.repository.BlogRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class BlogService {

    BlogRepository blogRepository;
    BlogMapper blogMapper;

    @PreAuthorize("hasRole('ADMIN')")
    public BlogResponse createBlog(BlogRequest request) {
        if (blogRepository.existsByBlogCode(request.getBlogCode()))
            throw new AppException(ErrorCode.BLOGCODE_EXIST);

        Blog blog = blogMapper.toBlog(request);
        Blog createdBlog = blogRepository.save(blog);
        return blogMapper.toBlogResponse(createdBlog);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public BlogResponse updateBlog(String blogCode, BlogRequest request) {
        Optional<Blog> existingBlog = blogRepository.findByBlogCode(blogCode);
        if (existingBlog.isPresent()) {
            Blog blog = existingBlog.get();
            blog.setTitle(request.getTitle());
            blog.setDescription(request.getDescription());
            Blog updatedBlog = blogRepository.save(blog);
            return blogMapper.toBlogResponse(updatedBlog);
        } else {
            throw new RuntimeException("Blog not found");
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    public void deleteBlog(String blogCode) {
        Optional<Blog> blogOptional = blogRepository.findByBlogCode(blogCode);
        if (blogOptional.isPresent()) {
            Blog blog = blogOptional.get();
            blog.setActive(false);
            blogRepository.save(blog);
            log.info(blog + " has been deactivated");
        } else {
            throw new EntityNotFoundException("Blog not found with Blog Code: " + blogCode);
        }
    }

    public BlogResponse getBlogByBlogCode(String blogCode) {
        return blogRepository.findByBlogCode(blogCode)
                .map(blogMapper::toBlogResponse)
                .orElseThrow(() -> new RuntimeException("Blog not found"));
    }

    public List<BlogResponse> getAllBlogs() {
        return blogRepository.findAll().stream()
                .map(blogMapper::toBlogResponse)
                .collect(Collectors.toList());
    }
}