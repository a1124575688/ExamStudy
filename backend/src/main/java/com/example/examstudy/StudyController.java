package com.example.examstudy;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class StudyController {

    private final StudyService studyService;

    public StudyController(StudyService studyService) {
        this.studyService = studyService;
    }

    @GetMapping("/study-items")
    public ResponseEntity<List<StudyItemDTO>> getStudyItems() {
        return ResponseEntity.ok(studyService.listAllStudyItems());
    }

    @GetMapping("/review-tasks")
    public ResponseEntity<List<ReviewTaskDTO>> getReviewTasks() {
        return ResponseEntity.ok(studyService.listAllReviewTasks());
    }

    @PostMapping("/study-items")
    public ResponseEntity<StudyItemDTO> createStudyItem(@RequestBody StudyItemDTO dto) {
        return ResponseEntity.ok(studyService.saveStudyItem(dto));
    }

    @PutMapping("/study-items/{id}")
    public ResponseEntity<StudyItemDTO> updateStudyItem(@PathVariable Long id, @RequestBody StudyItemDTO dto) {
        return ResponseEntity.ok(studyService.updateStudyItem(id, dto));
    }

    @DeleteMapping("/study-items/{id}")
    public ResponseEntity<Void> deleteStudyItem(@PathVariable Long id) {
        studyService.deleteStudyItem(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/review-tasks/{id}/complete")
    public ResponseEntity<ReviewTaskDTO> completeReviewTask(@PathVariable Long id) {
        return ResponseEntity.ok(studyService.completeReviewTask(id));
    }

    @PostMapping("/review-tasks/{id}/skip")
    public ResponseEntity<ReviewTaskDTO> skipReviewTask(@PathVariable Long id) {
        return ResponseEntity.ok(studyService.skipReviewTask(id));
    }

    @PostMapping("/review-tasks/{id}/reset")
    public ResponseEntity<ReviewTaskDTO> resetReviewTask(@PathVariable Long id) {
        return ResponseEntity.ok(studyService.resetReviewTask(id));
    }

}
