package com.swp.user_service.service;

import com.swp.user_service.dto.request.PyschologistCreationRequest;
import com.swp.user_service.dto.request.PyschologistUpdateRequest;
import com.swp.user_service.entity.Pyschologist;
import com.swp.user_service.repository.PysRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PysService {

    @Autowired
    private PysRepository pysRepository;

    public Pyschologist createPyschologist(PyschologistCreationRequest request) {
        Pyschologist pyschologist = new Pyschologist();
        pyschologist.setName(request.getName());
        pyschologist.setEmail(request.getEmail());
        pyschologist.setPassword(request.getPassword());
        pyschologist.setSpecialization(request.getSpecialization());
        return pysRepository.save(pyschologist);
    }

    public Pyschologist updatePyschologist(String pysId, PyschologistUpdateRequest request) {
        Pyschologist pyschologist = getPyschologist(pysId);
        pyschologist.setSpecialization(request.getSpecialization());
        return pysRepository.save(pyschologist);
    }

    public List<Pyschologist> getPyschologists() {
        return pysRepository.findAll();
    }

    public Pyschologist getPyschologist(String pysId) {
        return pysRepository.findById(pysId)
                .orElseThrow(() -> new RuntimeException("Pyschologist not found"));
    }

    public void deletePyschologist(String pysId) {
        pysRepository.deleteById(pysId);
    }
}
