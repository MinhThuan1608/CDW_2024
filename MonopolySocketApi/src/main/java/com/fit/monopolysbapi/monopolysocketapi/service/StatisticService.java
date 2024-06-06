package com.fit.monopolysbapi.monopolysocketapi.service;

import com.fit.monopolysbapi.monopolysocketapi.model.Match;
import com.fit.monopolysbapi.monopolysocketapi.model.Statistic;
import com.fit.monopolysbapi.monopolysocketapi.repository.MatchRepository;
import com.fit.monopolysbapi.monopolysocketapi.repository.StatisticRepository;
import com.fit.monopolysbapi.monopolysocketapi.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class StatisticService {

    private final StatisticRepository statisticRepository;
    private final MatchRepository matchRepository;
    private final UserRepository userRepository;

    public void log(int userLoginCount, int matchCount, int newUserCount, Date logDate){
        Statistic statistic = Statistic.builder()
                .matchCount(matchCount)
                .userLoginCount(userLoginCount)
                .newUserCount(newUserCount)
                .logDate(logDate).build();
        statisticRepository.save(statistic);
    }

    public int countLoginUserInDay(Date lastDay, Date today){
        return userRepository.countUserByLastLoginDateBetween(lastDay, today);
    }

    public int countMatchInDay(Date lastDay, Date today){
        return matchRepository.countMatchByStartAtBetween(lastDay, today);
    }

    public int countNewUser(Date lastDay, Date today){
        return userRepository.countByCreateDateBetween(lastDay, today);
    }

    public List<Statistic> getStatisticBetween(Date from, Date to){
        List<Statistic> statistics = statisticRepository.getByLogDateBetweenOrderByLogDateAsc(from, to);
        Date lastLogDate = statistics.get(statistics.size()-1).getLogDate();
        Date now = new Date();
        int loginToday = userRepository.countUserByLastLoginDateBetween(lastLogDate, now);
        int matchToday = matchRepository.countMatchByStartAtBetween(lastLogDate, now);
        int registerToday = userRepository.countByCreateDateBetween(lastLogDate, now);
        statistics.addLast(Statistic.builder().userLoginCount(loginToday).matchCount(matchToday).newUserCount(registerToday).logDate(now).build());
        return statistics;
    }

    public List<Match> getMatches(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return matchRepository.findAll(pageable).getContent();
    }
}
