package com.example.examstudy;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class StudyService {

    private static final List<Integer> EBBINGHAUS_INTERVALS = List.of(1, 2, 4, 7, 15, 30);
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    private final StudyItemRepository studyItemRepository;
    private final ReviewTaskRepository reviewTaskRepository;

    public StudyService(StudyItemRepository studyItemRepository, ReviewTaskRepository reviewTaskRepository) {
        this.studyItemRepository = studyItemRepository;
        this.reviewTaskRepository = reviewTaskRepository;
    }

    @Transactional(readOnly = true)
    public List<StudyItemDTO> listAllStudyItems() {
        return studyItemRepository.findAll().stream()
                .map(StudyItemDTO::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ReviewTaskDTO> listAllReviewTasks() {
        return reviewTaskRepository.findAll().stream()
                .map(ReviewTaskDTO::fromEntity)
                .toList();
    }

    public StudyItemDTO saveStudyItem(StudyItemDTO dto) {
        StudyItem entity = dto.toEntity();
        String studyDate = entity.getStudyDate();
        if (studyDate == null || studyDate.isBlank()) {
            studyDate = LocalDate.now().format(DATE_FORMATTER);
            entity.setStudyDate(studyDate);
        } else {
            entity.setStudyDate(normalizeDate(studyDate));
        }
        StudyItem saved = studyItemRepository.save(entity);
        generateReviewTasks(saved);
        return StudyItemDTO.fromEntity(saved);
    }

    public StudyItemDTO updateStudyItem(Long id, StudyItemDTO dto) {
        StudyItem existing = studyItemRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Study item not found: " + id));
        String oldStudyDate = existing.getStudyDate();
        existing.setContent(dto.getContent());
        existing.setTag(dto.getTag());

        String newStudyDate = dto.getStudyDate();
        if (newStudyDate == null || newStudyDate.isBlank()) {
            newStudyDate = LocalDate.now().format(DATE_FORMATTER);
        } else {
            newStudyDate = normalizeDate(newStudyDate);
        }
        existing.setStudyDate(newStudyDate);

        StudyItem updated = studyItemRepository.save(existing);

        if (!newStudyDate.equals(oldStudyDate)) {
            reviewTaskRepository.deleteByStudyItemId(id);
            generateReviewTasks(updated);
        }

        return StudyItemDTO.fromEntity(updated);
    }

    public void deleteStudyItem(Long id) {
        StudyItem item = studyItemRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Study item not found: " + id));
        reviewTaskRepository.deleteByStudyItemId(id);
        studyItemRepository.delete(item);
    }

    public ReviewTaskDTO completeReviewTask(Long id) {
        ReviewTask task = reviewTaskRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Review task not found: " + id));
        task.setStatus("completed");
        task.setCompletedAt(LocalDate.now().format(DATE_FORMATTER));
        return ReviewTaskDTO.fromEntity(reviewTaskRepository.save(task));
    }

    public ReviewTaskDTO skipReviewTask(Long id) {
        ReviewTask task = reviewTaskRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Review task not found: " + id));
        task.setStatus("skipped");
        task.setCompletedAt(LocalDate.now().format(DATE_FORMATTER));
        return ReviewTaskDTO.fromEntity(reviewTaskRepository.save(task));
    }

    public ReviewTaskDTO resetReviewTask(Long id) {
        ReviewTask task = reviewTaskRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Review task not found: " + id));
        task.setStatus("pending");
        task.setCompletedAt(null);
        return ReviewTaskDTO.fromEntity(reviewTaskRepository.save(task));
    }

    private void generateReviewTasks(StudyItem studyItem) {
        LocalDate baseDate;
        try {
            baseDate = LocalDate.parse(studyItem.getStudyDate(), DATE_FORMATTER);
        } catch (DateTimeParseException e) {
            baseDate = LocalDate.now();
        }
        List<ReviewTask> tasks = new ArrayList<>();
        for (Integer interval : EBBINGHAUS_INTERVALS) {
            ReviewTask task = new ReviewTask();
            task.setStudyItem(studyItem);
            task.setInterval(interval);
            task.setReviewDate(baseDate.plusDays(interval).format(DATE_FORMATTER));
            task.setStatus("pending");
            task.setCompletedAt(null);
            tasks.add(task);
        }
        reviewTaskRepository.saveAll(tasks);
    }

    private String normalizeDate(String date) {
        if (date == null || date.isBlank()) {
            return LocalDate.now().format(DATE_FORMATTER);
        }
        try {
            return LocalDate.parse(date, DATE_FORMATTER).format(DATE_FORMATTER);
        } catch (DateTimeParseException e) {
            return date.trim();
        }
    }

}
