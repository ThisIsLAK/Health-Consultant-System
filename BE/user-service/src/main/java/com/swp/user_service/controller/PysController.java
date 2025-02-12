package com.swp.user_service.controller;

import com.swp.user_service.dto.request.PyschologistCreationRequest;
import com.swp.user_service.dto.request.PyschologistUpdateRequest;
import com.swp.user_service.entity.Pyschologist;
import com.swp.user_service.service.PysService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pyschologists")
public class PysController {
    @Autowired
    private PysService pysService;

    @PostMapping
    public Pyschologist createPyschologist(@RequestBody PyschologistCreationRequest request) {
        return pysService.createPyschologist(request);
    }

    @GetMapping
    public List<Pyschologist> getPyschologists() {
        return pysService.getPyschologists();
    }

    @GetMapping("/{pysId}")
    public Pyschologist getPyschologist(@PathVariable String pysId) {
        return pysService.getPyschologist(pysId);
    }

    @PutMapping("/{pysId}")
    public Pyschologist updatePyschologist(@PathVariable String pysId, @RequestBody PyschologistUpdateRequest request) {
        return pysService.updatePyschologist(pysId, request);
    }

    @DeleteMapping("/{pysId}")
    public String deletePyschologist(@PathVariable String pysId) {
        pysService.deletePyschologist(pysId);
        return "Pyschologist has been deleted";
    }
}
