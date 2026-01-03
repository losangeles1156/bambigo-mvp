import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildL4DefaultQuestionTemplates,
  classifyQuestion,
  extractOdptStationIds,
  filterFaresForOrigin,
  filterTimetablesForStation,
  findSimpleRoutes,
  normalizeOdptStationId,
  type RailwayTopology,
} from './assistantEngine';

test('extractOdptStationIds normalizes odpt:Station prefix', () => {
  const ids = extractOdptStationIds('to: odpt:Station:TokyoMetro.Ginza.Ueno and odpt.Station:Toei.Asakusa.Asakusa');
  assert.deepEqual(new Set(ids), new Set(['odpt.Station:TokyoMetro.Ginza.Ueno', 'odpt.Station:Toei.Asakusa.Asakusa']));
});

test('classifyQuestion detects fare/timetable/route intents', () => {
  assert.equal(classifyQuestion('票價 to: odpt.Station:TokyoMetro.Ginza.Ueno', 'zh-TW').kind, 'fare');
  assert.equal(classifyQuestion('時刻表', 'zh-TW').kind, 'timetable');
  assert.equal(classifyQuestion('怎麼去 odpt.Station:TokyoMetro.Ginza.Ueno', 'zh-TW').kind, 'route');
});

test('filterFaresForOrigin isolates station data', () => {
  const fares: any[] = [
    { '@id': '1', 'odpt:fromStation': 'odpt.Station:TokyoMetro.Ginza.Ueno', 'odpt:toStation': 'odpt.Station:TokyoMetro.Ginza.Asakusa', 'odpt:icCardFare': 170, 'odpt:ticketFare': 180 },
    { '@id': '2', 'odpt:fromStation': 'odpt.Station:TokyoMetro.Marunouchi.Tokyo', 'odpt:toStation': 'odpt.Station:TokyoMetro.Ginza.Ueno', 'odpt:icCardFare': 200, 'odpt:ticketFare': 210 },
    { '@id': '3', 'odpt:fromStation': 'odpt:Station:TokyoMetro.Ginza.Ueno', 'odpt:toStation': 'odpt.Station:TokyoMetro.Ginza.Suehirocho', 'odpt:icCardFare': 170, 'odpt:ticketFare': 180 },
  ];
  const filtered = filterFaresForOrigin(fares, 'odpt.Station:TokyoMetro.Ginza.Ueno');
  assert.equal(filtered.length, 2);
  assert.ok(filtered.every(f => normalizeOdptStationId(f['odpt:fromStation']) === 'odpt.Station:TokyoMetro.Ginza.Ueno'));
});

test('filterTimetablesForStation isolates station data', () => {
  const timetables: any[] = [
    { '@id': '1', 'odpt:station': 'odpt.Station:TokyoMetro.Ginza.Ueno', 'odpt:railDirection': 'odpt.RailDirection:TokyoMetro.Asakusa', 'odpt:calendar': 'odpt.Calendar:Weekday', 'odpt:stationTimetableObject': [] },
    { '@id': '2', 'odpt:station': 'odpt.Station:TokyoMetro.Marunouchi.Tokyo', 'odpt:railDirection': 'odpt.RailDirection:TokyoMetro.Ikebukuro', 'odpt:calendar': 'odpt.Calendar:Weekday', 'odpt:stationTimetableObject': [] },
    { '@id': '3', 'odpt:station': 'odpt:Station:TokyoMetro.Ginza.Ueno', 'odpt:railDirection': 'odpt.RailDirection:TokyoMetro.Shibuya', 'odpt:calendar': 'odpt.Calendar:SaturdayHoliday', 'odpt:stationTimetableObject': [] },
  ];
  const filtered = filterTimetablesForStation(timetables, 'odpt.Station:TokyoMetro.Ginza.Ueno');
  assert.equal(filtered.length, 2);
  assert.ok(filtered.every(t => normalizeOdptStationId(t['odpt:station']) === 'odpt.Station:TokyoMetro.Ginza.Ueno'));
});

test('findSimpleRoutes returns up to 3 routes and respects topology', () => {
  const origin = 'odpt.Station:TokyoMetro.Ginza.A';
  const dest = 'odpt.Station:TokyoMetro.Ginza.J';

  const stationOrder = Array.from({ length: 10 }).map((_, i) => ({
    index: i + 1,
    station: `odpt.Station:TokyoMetro.Ginza.${String.fromCharCode('A'.charCodeAt(0) + i)}`,
  }));

  const railways: RailwayTopology[] = [
    {
      railwayId: 'odpt.Railway:TokyoMetro.Ginza',
      operator: 'odpt.Operator:TokyoMetro',
      stationOrder,
    },
  ];

  const routes = findSimpleRoutes({ originStationId: origin, destinationStationId: dest, railways, maxHops: 30 });
  assert.ok(routes.length >= 1);
  assert.ok(routes.length <= 3);
  const rendered = routes[0].steps.join(' ');
  assert.ok(rendered.includes(origin.split(':').pop()!));
  assert.ok(rendered.includes(dest.split(':').pop()!));
});

test('buildL4DefaultQuestionTemplates returns categorized templates with origin embedded', () => {
  const origin = 'odpt.Station:TokyoMetro.Ginza.Ueno';
  const templates = buildL4DefaultQuestionTemplates({ originStationId: origin, locale: 'zh-TW' });
  assert.ok(templates.length >= 6);
  assert.ok(templates.some(t => t.category === 'basic'));
  assert.ok(templates.some(t => t.category === 'advanced'));
  assert.ok(templates.some(t => t.category === 'feature'));
  const nonDemo = templates.filter(t => !t.id.startsWith('demo-'));
  assert.ok(nonDemo.every(t => t.text.includes(origin)));
});

test('stress: handles concurrent-style queries and large datasets', () => {
  const origin = 'odpt.Station:TokyoMetro.Ginza.Ueno';
  const other = 'odpt.Station:TokyoMetro.Marunouchi.Tokyo';

  const fares: any[] = [];
  for (let i = 0; i < 5000; i++) {
    fares.push({ '@id': `o-${i}`, 'odpt:fromStation': origin, 'odpt:toStation': 'odpt.Station:TokyoMetro.Ginza.Asakusa', 'odpt:icCardFare': 170, 'odpt:ticketFare': 180 });
    fares.push({ '@id': `x-${i}`, 'odpt:fromStation': other, 'odpt:toStation': 'odpt.Station:TokyoMetro.Ginza.Ueno', 'odpt:icCardFare': 200, 'odpt:ticketFare': 210 });
  }
  const filteredFares = filterFaresForOrigin(fares, origin);
  assert.equal(filteredFares.length, 5000);

  const timetables: any[] = [];
  for (let i = 0; i < 2000; i++) {
    timetables.push({ '@id': `t-o-${i}`, 'odpt:station': origin, 'odpt:railDirection': 'odpt.RailDirection:TokyoMetro.Asakusa', 'odpt:calendar': 'odpt.Calendar:Weekday', 'odpt:stationTimetableObject': [{ 'odpt:departureTime': '08:00' }] });
    timetables.push({ '@id': `t-x-${i}`, 'odpt:station': other, 'odpt:railDirection': 'odpt.RailDirection:TokyoMetro.Ikebukuro', 'odpt:calendar': 'odpt.Calendar:Weekday', 'odpt:stationTimetableObject': [{ 'odpt:departureTime': '08:10' }] });
  }
  const filteredTimetables = filterTimetablesForStation(timetables, origin);
  assert.equal(filteredTimetables.length, 2000);

  for (let i = 0; i < 200; i++) {
    const q1 = `票價 to: odpt.Station:TokyoMetro.Ginza.Asakusa #${i}`;
    const q2 = `時刻表 station: ${origin} #${i}`;
    const q3 = `怎麼去 odpt.Station:TokyoMetro.Ginza.Asakusa from: ${origin} #${i}`;
    assert.equal(classifyQuestion(q1, 'zh-TW').kind, 'fare');
    assert.equal(classifyQuestion(q2, 'zh-TW').kind, 'timetable');
    assert.equal(classifyQuestion(q3, 'zh-TW').kind, 'route');
  }
});
