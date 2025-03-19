package com.swp.user_service.configuration;

import com.swp.user_service.entity.Survey;
//import com.swp.user_service.entity.SurveySuggestion;
import com.swp.user_service.entity.User;
import com.swp.user_service.entity.Role;
import com.swp.user_service.repository.RoleRepository;
import com.swp.user_service.repository.SurveyRepository;
//import com.swp.user_service.repository.SurveySuggestionRepository;
import com.swp.user_service.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Date;
import java.util.List;


@Configuration
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ApplicationInitConfig {

    PasswordEncoder passwordEncoder;

    @Bean
    ApplicationRunner applicationRunner(UserRepository userRepository
                                        , RoleRepository roleRepository
                                        , SurveyRepository surveyRepository) {
        return args -> {
            if (roleRepository.count() == 0 ) {
                // Lấy Role ADMIN từ database
                List<Role> roles = List.of(
                        new Role("1", "ADMIN","admin",true ),
                        new Role("2", "STUDENT","student",true ),
                        new Role("3", "MANAGER","manager",true ),
                        new Role("4", "PSYCHOLOGIST","psychologist",true ),
                        new Role("5", "PARENT","parent",true)
                );
                roleRepository.saveAll(roles);
                log.warn("All roles have been created");
            }

            if (userRepository.findByEmail("admin@gmail.com").isEmpty()) {

                // Lấy Role ADMIN từ database
                Role adminRole = roleRepository.findByRoleName("ADMIN")
                        .orElseThrow(() ->  new RuntimeException("Role ADMIN not found!"));

                User user = User.builder()
                        .name("admin")
                        .email("admin@gmail.com")
                        .password(passwordEncoder.encode("admin123"))
                        .role(adminRole)  // Gán Role entity
                        .build();

                userRepository.save(user);
                log.warn("Admin has been created with default password admin123, please change it");
            }

            // Thêm Survey nếu chưa có
            if (surveyRepository.count() == 0
                    || (surveyRepository.findBySurveyCode("gad-7")).isEmpty()
                            && (surveyRepository.findBySurveyCode("phq-9")).isEmpty()) {
                Survey gad7Survey = Survey.builder()
                        .surveyCode("gad-7")
                        .title("Generalized Anxiety Disorder Assessment")
                        .description("A screening tool for generalized anxiety disorder.")
                        .createdDate(new Date())
                        .active(true)
                        .build();

                Survey phq9Survey = Survey.builder()
                        .surveyCode("phq-9")
                        .title("Patient Health Questionnaire for Depression")
                        .description("A screening tool for depression severity.")
                        .createdDate(new Date())
                        .active(true)
                        .build();

                surveyRepository.saveAll(List.of(gad7Survey, phq9Survey));
                surveyRepository.flush();
                log.warn("GAD-7 & PHQ-9 surveys have been created");
            }

//            // Thêm dữ liệu SurveySuggestion nếu chưa có
//            if (surveySuggestionRepository.count() == 0) {
//                Survey gad7Survey = surveyRepository.findBySurveyCode("gad-7")
//                        .orElseThrow(() -> new RuntimeException("Survey GAD-7 not found!"));
//
//                Survey phq9Survey = surveyRepository.findBySurveyCode("phq-9")
//                        .orElseThrow(() -> new RuntimeException("Survey PHQ-9 not found!"));
//
//                List<SurveySuggestion> suggestions = List.of(
//                        // Gợi ý cho GAD-7
//                        SurveySuggestion.builder().survey(gad7Survey).minScore(0).maxScore(4)
//                                .suggestion("Không có lo âu hoặc lo âu nhẹ.").build(),
//                        SurveySuggestion.builder().survey(gad7Survey).minScore(5).maxScore(9)
//                                .suggestion("Lo âu mức độ nhẹ, theo dõi các triệu chứng.").build(),
//                        SurveySuggestion.builder().survey(gad7Survey).minScore(10).maxScore(14)
//                                .suggestion("Lo âu mức độ vừa, nên tham khảo chuyên gia.").build(),
//                        SurveySuggestion.builder().survey(gad7Survey).minScore(15).maxScore(21)
//                                .suggestion("Lo âu mức độ nặng, cần hỗ trợ y tế ngay.").build(),
//
//                        // Gợi ý cho PHQ-9
//                        SurveySuggestion.builder().survey(phq9Survey).minScore(0).maxScore(4)
//                                .suggestion("Không có hoặc trầm cảm nhẹ.").build(),
//                        SurveySuggestion.builder().survey(phq9Survey).minScore(5).maxScore(9)
//                                .suggestion("Trầm cảm nhẹ, xem xét tư vấn chuyên gia.").build(),
//                        SurveySuggestion.builder().survey(phq9Survey).minScore(10).maxScore(14)
//                                .suggestion("Trầm cảm trung bình, cần được hỗ trợ chuyên nghiệp.").build(),
//                        SurveySuggestion.builder().survey(phq9Survey).minScore(15).maxScore(27)
//                                .suggestion("Trầm cảm nặng, nên gặp bác sĩ tâm lý ngay.").build()
//                );
//
//                surveySuggestionRepository.saveAll(suggestions);
//                log.warn("Survey suggestions have been created");
//            }
        };
    }
}
