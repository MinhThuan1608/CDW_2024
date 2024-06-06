package com.fit.monopolysbapi.monopolysocketapi.controller;

import com.fit.monopolysbapi.monopolysocketapi.model.Match;
import com.fit.monopolysbapi.monopolysocketapi.model.Statistic;
import com.fit.monopolysbapi.monopolysocketapi.model.User;
import com.fit.monopolysbapi.monopolysocketapi.response.AbstractResponse;
import com.fit.monopolysbapi.monopolysocketapi.response.ListUserResponseAdmin;
import com.fit.monopolysbapi.monopolysocketapi.response.UserResponse;
import com.fit.monopolysbapi.monopolysocketapi.service.StatisticService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class StatisticController {
    private final StatisticService statisticService;

    @Scheduled(cron = "0 0 4 * * ?")
    public void logStatistic(){
        Calendar lastDateCal = Calendar.getInstance();
        lastDateCal.add(Calendar.DATE, -1);
        Date lastDate = lastDateCal.getTime();
        Date today = new Date();
        int countUserLogin = statisticService.countLoginUserInDay(lastDate, today);
        int countMatch = statisticService.countMatchInDay(lastDate, today);
        int countNewUser = statisticService.countNewUser(lastDate, today);
        statisticService.log(countUserLogin, countMatch, countNewUser, today);
    }

    @GetMapping("/statistics")
    public ResponseEntity<?> getUserStatistic(){
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DATE, -30);
        calendar.set(Calendar.HOUR, 4);
        List<Statistic> statistics = statisticService.getStatisticBetween(calendar.getTime(), new Date());
        return ResponseEntity.ok(new AbstractResponse(200, "Get statistics successfully!", statistics));
    }

    @PatchMapping("/search/matches")
    public  ResponseEntity<?>  searchForMatches(@RequestBody ListUserResponseAdmin listUserResponseAdmin) {
        int size = 5;
        Pageable pageable = PageRequest.of(listUserResponseAdmin.getPage(), size, Sort.by("startAt").descending());
        List<Match> matches = statisticService.searchMatches(listUserResponseAdmin.getId(), pageable).getContent();
        int totalPage = statisticService.searchMatches(listUserResponseAdmin.getId(), pageable).getTotalPages();
        listUserResponseAdmin.setMatches(matches);
        listUserResponseAdmin.setTotalPage(totalPage);

        return ResponseEntity.ok(new AbstractResponse(200, "List match here!", listUserResponseAdmin));
    }

}
