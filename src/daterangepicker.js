(function() {
  'use strict';

  var app, contains;

  app = angular.module('fc.dateRange', []);

  contains = function(container, contained) {
    var node;
    node = contained.parentNode;
    while (node !== null && node !== container) {
      node = node.parentNode;
    }
    return node !== null;
  };

  app.directive("outsideClick", [
    '$document', '$parse',
    function($document, $parse) {
      return {
        link: function($scope, $element, $attributes) {
          var onDocumentClick, scopeExpression;
          scopeExpression = $attributes.outsideClick;
          onDocumentClick = function(event) {
            if (!contains($element[0], event.target)) {
              $scope.$apply(scopeExpression);
            }
          };
          $document.on("click", onDocumentClick);
          $element.on("$destroy", function() {
            $document.off("click", onDocumentClick);
          });
        }
      };
    }
  ]);

  app.directive('daterangePicker', ['$timeout', function($timeout) {
    return {
      scope: {
        dateLabel: '@',
        startDate: '=',
        endDate: '=?',
        minDate: '@',
        maxDate: '@',
        dateType: '@',
        dateLength: '=?',
        dateLang: '@',
        shouldRefresh: '@'
      },
      template: ['<div id="dateRangeSelectors" outside-click="hidePicker()">',
        '<span>{{dateLabel || lang.label}}</span>',
        '<md-button ng-click="showOrHide()" class="md-raised md-primary">{{ dateType === "range" ? startDate + lang.to + endDate : startDate }}</md-button>',
        '<div class="fc-datepicker-container" ng-class="{true: \'show-datepicker\', false: \'hide-datepicker\'}[isVisible]">',
        '  <div class="fc-datepicker start-datepicker">',
        '    <table>',
        '      <caption>',
        '        <div class="header-wrapper">',
        '           <md-button class="md-icon-button arraw-btn noselect pull-left" ng-click="startPreviousYear()">\<</md-button>',
        '           <span class="header-year noselect" ng-class="noselect">{{ startYear + lang.year}}</span>',
        '           <md-button class="md-icon-button arraw-btn noselect pull-right" ng-click="startNextYear()">\></md-button>',
        '        </div>',
        '        <div class="header-wrapper">',
        '           <md-button class="md-icon-button arraw-btn noselect pull-left" ng-click="startPreviousMonth()">\<</md-button>',
        '           <span class="header-month noselect">{{ startMonth + lang.month}}</span>',
        '           <md-button class="md-icon-button arraw-btn noselect pull-right" ng-click="startNextMonth()">\></md-button>',
        '        </div>',
        '      </caption>',
        '      <tbody>',
        '        <tr>',
        '          <td class="day-head">{{ lang.week.monday }}</td>',
        '          <td class="day-head">{{ lang.week.tuesday }}</td>',
        '          <td class="day-head">{{ lang.week.wednesday }}</td>',
        '          <td class="day-head">{{ lang.week.thursday }}</td>',
        '          <td class="day-head">{{ lang.week.friday }}</td>',
        '          <td class="day-head">{{ lang.week.saturday }}</td>',
        '          <td class="day-head">{{ lang.week.sunday }}</td>',
        '        </tr>',
        '        <tr class="days" ng-repeat="week in startWeeks">',
        '          <td class="noselect" ng-repeat="day in week">',
        '            <md-button class="md-icon-button day-button"  ng-class="day.class" ng-click="selectStartDate(day)">',
        '              {{ day.value.format(\'DD\') }}',
        '            </md-button>',
        '          </td>',
        '        </tr>',
        '      </tbody>',
        '    </table>',
        '  </div>',
        '  <div class="fc-datepicker end-datepicker" ng-show="dateType === \'range\'">',
        '    <table>',
        '      <caption>',
        '        <div class="header-wrapper">',
        '           <md-button class="md-icon-button arraw-btn noselect pull-left" ng-click="endPreviousYear()">\<</md-button>',
        '           <span class="header-year noselect" ng-class="noselect">{{ endYear  + lang.year}}</span>',
        '           <md-button class="md-icon-button arraw-btn noselect pull-right" ng-click="endNextYear()">\></md-button>',
        '        </div>',
        '        <div class="header-wrapper">',
        '           <md-button class="md-icon-button arraw-btn noselect pull-left" ng-click="endPreviousMonth()">\<</md-button>',
        '           <span class="header-month noselect">{{ endMonth + lang.month}}</span>',
        '           <md-button class="md-icon-button arraw-btn noselect pull-right" ng-click="endNextMonth()">\></md-button>',
        '        </div>',
        '      </caption>',
        '      <tbody>',
        '        <tr>',
        '          <td class="day-head">{{ lang.week.monday }}</td>',
        '          <td class="day-head">{{ lang.week.tuesday }}</td>',
        '          <td class="day-head">{{ lang.week.wednesday }}</td>',
        '          <td class="day-head">{{ lang.week.thursday }}</td>',
        '          <td class="day-head">{{ lang.week.friday }}</td>',
        '          <td class="day-head">{{ lang.week.saturday }}</td>',
        '          <td class="day-head">{{ lang.week.sunday }}</td>',
        '        </tr>',
        '        <tr class="days" ng-repeat="week in endWeeks">',
        '          <td class="noselect" ng-repeat="day in week">',
        '           <md-button class="md-icon-button day-button" ng-class="day.class" ng-click="selectEndDate(day)">',
        '             {{ day.value.format(\'DD\') }}',
        '           </md-button>',
        '          </td>',
        '        </tr>',
        '      </tbody>',
        '    </table>',
        '  </div>',
        '<div class="fc-datepicker-button">',
        // '<md-button class="md-raised">取消</md-button>',
        '<md-button class="md-raised md-primary" ng-click="hidePicker()">{{lang.confirm}}</md-button>',
        '</div>',
        '</div>',
        '</div>'
      ].join(""),
      restrict: 'E',
      transclude: true,
      link: function(scope, element, attrs) {
        var lang = {
          en: {
            to: " To ",
            label: "Date: ",
            year: "",
            month: "",
            week: {
              monday: "Mon",
              tuesday: "Tue",
              wednesday: "Wed",
              thursday: "Thu",
              friday: "Fri",
              saturday: "Sat",
              sunday: "Sun"
            },
            confirm: "Confirm"
          },
          cn: {
            to: " 至 ",
            label: "日期：",
            year: "年",
            month: "月",
            week: {
              monday: '一',
              tuesday: '二',
              wednesday: '三',
              thursday: '四',
              friday: '五',
              saturday: '六',
              sunday: '日'
            },
            confirm: "确定"
          }
        };

        var getWeeks, init, selectors;
        selectors = document.querySelector('#dateSelectors');

        scope.startMonth = scope.endMonth = scope.month = '';
        scope.startYear = scope.endYear = scope.year = '';

        scope.dateFormat = "YYYY-MM-DD";
        if (scope.minDate) {
          scope.minDate = moment(scope.minDate, scope.dateFormat);
        }
        if (scope.maxDate) {
          scope.maxDate = moment(scope.maxDate, scope.dateFormat);
        }
        if (scope.dateType !== "range") {
          scope.endDate = "9999-12-31";
        }
        if (scope.dateLang === "cn") {
          scope.lang = lang.cn;
        } else {
          scope.lang = lang.en;
        }
        getWeeks = function(monthLength, startDay, month, isStart) {
          var day, monthDays, newDate, weeks = [];
          monthDays = [];
          if (scope.minDate) {
            scope.minDate = moment(scope.minDate, scope.dateFormat);
          }
          if (scope.maxDate) {
            scope.maxDate = moment(scope.maxDate, scope.dateFormat);
          }
          var start = moment(scope.startDate, scope.dateFormat);
          var end = moment(scope.endDate, scope.dateFormat);
          var myDay;
          for (day = 0; day < monthLength; day++) {
            newDate = moment(startDay).add(day, 'd');
            myDay = {
              value: newDate,
              isEnabled: true,
              isCurrentMonth: false,
              class: "day-item"
            };

            if (newDate.month() === month) {
              myDay.isCurrentMonth = true;
              myDay.class = "day-item current-month";
            }

            if (scope.minDate && newDate < scope.minDate || scope.maxDate && newDate > scope.maxDate || isStart && newDate > end || !isStart && newDate < start) {
              myDay.isEnabled = false;
              myDay.class = "disabled";
            } else if (newDate >= start && newDate <= end && scope.dateType === "range") {
              myDay.class = "day-item selected";
            } else {
              if (!myDay.isCurrentMonth) {
                myDay.class = "day-item";
              }
            }

            if (newDate.format(scope.dateFormat) === scope.startDate && scope.dateType !== "range") {
              myDay.class = "day-item selected";
            }

            monthDays.push(myDay);
          }
          var len = monthDays.length;
          if (len > 0) {
            var temp = Math.ceil(len / 7);
            for (var i = 0; i < temp; i++) {
              weeks.push(monthDays.slice(i * 7, i * 7 + 7 >= len ? len : i * 7 + 7));
            }
          }
          return weeks;
        };
        scope.startNextMonth = function() {
          var data = getData(moment(scope.startYear + '-' + scope.startMonth + '-01', scope.dateFormat).add(1, 'months'), true);
          scope.startYear = data.year;
          scope.startMonth = data.month;
          scope.startWeeks = data.weeks;
        };
        scope.endNextMonth = function() {
          var data = getData(moment(scope.endYear + '-' + scope.endMonth + '-01', scope.dateFormat).add(1, 'months'), false);
          scope.endYear = data.year;
          scope.endMonth = data.month;
          scope.endWeeks = data.weeks;
        };
        scope.startPreviousMonth = function() {
          var data = getData(moment(scope.startYear + '-' + scope.startMonth + '-01', scope.dateFormat).subtract(1, 'months'), true);
          scope.startYear = data.year;
          scope.startMonth = data.month;
          scope.startWeeks = data.weeks;
        };
        scope.endPreviousMonth = function() {
          var data = getData(moment(scope.endYear + '-' + scope.endMonth + '-01', scope.dateFormat).subtract(1, 'months'), false);
          scope.endYear = data.year;
          scope.endMonth = data.month;
          scope.endWeeks = data.weeks;
        };
        scope.startNextYear = function() {
          var data = getData(moment(scope.startYear + '-' + scope.startMonth + '-01', scope.dateFormat).add(1, 'years'), true);
          scope.startYear = data.year;
          scope.startMonth = data.month;
          scope.startWeeks = data.weeks;
        };
        scope.endNextYear = function() {
          var data = getData(moment(scope.endYear + '-' + scope.endMonth + '-01', scope.dateFormat).add(1, 'years'), false);
          scope.endYear = data.year;
          scope.endMonth = data.month;
          scope.endWeeks = data.weeks;
        };
        scope.startPreviousYear = function() {
          var data = getData(moment(scope.startYear + '-' + scope.startMonth + '-01', scope.dateFormat).subtract(1, 'years'), true);
          scope.startYear = data.year;
          scope.startMonth = data.month;
          scope.startWeeks = data.weeks;
        };
        scope.endPreviousYear = function() {
          var data = getData(moment(scope.endYear + '-' + scope.endMonth + '-01', scope.dateFormat).subtract(1, 'years'), false);
          scope.endYear = data.year;
          scope.endMonth = data.month;
          scope.endWeeks = data.weeks;
        };

        function processDay(isCurrentMonth, day, isStart) {
          var start = moment(scope.startDate, scope.dateFormat);
          var end = moment(scope.endDate, scope.dateFormat);
          var tempweeks;

          if (!isCurrentMonth) {
            var temp = getData(day.value, isStart);

            if (isStart) {
              scope.startYear = temp.year;
              scope.startMonth = temp.month;
              scope.startWeeks = temp.weeks;
              tempweeks = scope.startWeeks;
            } else {
              scope.endYear = temp.year;
              scope.endMonth = temp.month;
              scope.endWeeks = temp.weeks;
              tempweeks = scope.endWeeks;
            }

          } else {
            if (isStart) {
              tempweeks = scope.startWeeks;
            } else {
              tempweeks = scope.endWeeks;
            }
          }
          if (scope.dateType === "range") {
            tempweeks.forEach(function(week) {
              week.forEach(function(d) {
                d.isEnabled = true;
                if (scope.minDate && d.value < scope.minDate || scope.maxDate && d.value > scope.maxDate || !isStart && d.value < start || isStart && d.value > end) {
                  d.class = "disabled";
                  d.isEnabled = false;
                } else if (d.value >= start && d.value <= end && scope.dateType === "range") {
                  d.class = "day-item selected";
                }
              });
            });

            scope.startWeeks.forEach(function(week) {
              week.forEach(function(d) {
                if (scope.minDate && d.value < scope.minDate || scope.maxDate && d.value > scope.maxDate || d.value > end) {
                  d.class = "disabled";
                  d.isEnabled = false;
                } else if (d.value >= start && d.value <= end) {
                  d.class = "day-item selected";
                } else {
                  if (d.class === "day-item selected" && d.isCurrentMonth) {
                    d.class = "day-item current-month";
                  } else if (d.class === "day-item selected" && !d.isCurrentMonth) {
                    d.class = "day-item";
                  }
                }

              });
            });
            scope.endWeeks.forEach(function(week) {
              week.forEach(function(d) {
                if (scope.minDate && d.value < scope.minDate || scope.maxDate && d.value > scope.maxDate || d.value < start) {
                  d.class = "disabled";
                  d.isEnabled = false;
                } else if (d.value >= start && d.value <= end) {
                  d.class = "day-item selected";
                } else {
                  if (d.class === "day-item selected" && d.isCurrentMonth) {
                    d.class = "day-item current-month";
                  } else if (d.class === "day-item selected" && !d.isCurrentMonth) {
                    d.class = "day-item";
                  }
                }
              });
            });
          }


        }

        function _processDay(isCurrentMonth, day, isStart) {
          return function() {
            processDay(isCurrentMonth, day, isStart);
          };
        }

        scope.selectStartDate = function(day) {
          if (day.isEnabled) {
            scope.startWeeks.forEach(function(week) {
              week.forEach(function(day) {
                if (day.class === "day-item selected" && day.isCurrentMonth) {
                  day.class = "day-item current-month";
                } else if (day.class === "day-item selected" && !day.isCurrentMonth) {
                  day.class = "day-item";
                }
              });
            });
            scope.startDate = day.value.format(scope.dateFormat);
            scope.dateLength = moment(scope.endDate).diff(moment(scope.startDate), 'days') + 1;
            day.class = "day-item selected";

            if (!day.isCurrentMonth) {
              $timeout(_processDay(false, day, true), 10);
            } else {
              processDay(true, day, true);
            }
          }
        };

        scope.selectEndDate = function(day) {
          if (day.isEnabled) {
            scope.endWeeks.forEach(function(week) {
              week.forEach(function(day) {
                if (day.class === "day-item selected" && day.isCurrentMonth) {
                  day.class = "day-item current-month";
                } else if (day.class === "day-item selected" && !day.isCurrentMonth) {
                  day.class = "day-item";
                }
              });
            });
            scope.endDate = day.value.format(scope.dateFormat);
            scope.dateLength = moment(scope.endDate).diff(moment(scope.startDate), 'days') + 1;
            day.class = "day-item selected";

            var start = moment(scope.startDate, scope.dateFormat);
            var end = moment(scope.endDate, scope.dateFormat);

            if (!day.isCurrentMonth) {
              $timeout(_processDay(false, day, false), 10);
            } else {
              processDay(true, day, false);
            }
          }
        };

        scope.isVisible = false;
        scope.showOrHide = function() {
          if (scope.isVisible) {
            scope.hidePicker();
          } else {
            scope.showPicker();
          }
        };
        scope.showPicker = function() {
          scope.isVisible = true;
          if (scope.shouldRefresh) {
            init();
          }
        };
        scope.hidePicker = function() {
          scope.isVisible = false;
        };

        var getData = function(mo, isStart) {
          var firstMonday, endDate, weeks, year, month, monthLength;

          mo = mo ? moment(mo) : moment();
          month = mo.format('M');
          year = mo.format('YYYY');

          firstMonday = moment(mo).date(1).startOf('isoweek');
          endDate = moment(mo).add(1, 'months').date(0);
          if (endDate.day() !== 0) {
            endDate = endDate.add(7 - endDate.day(), 'days');
          }

          monthLength = endDate.diff(firstMonday, 'days') + 1;
          weeks = getWeeks(monthLength, firstMonday, mo.month(), isStart);

          return {
            year: year,
            month: month,
            weeks: weeks
          };
        };

        init = function() {
          var startData = getData(scope.startDate, true);
          scope.startMonth = startData.month;
          scope.startYear = startData.year;
          scope.startWeeks = startData.weeks;

          if (scope.dateType === "range") {
            var endData = getData(scope.endDate, false);
            scope.endMonth = endData.month;
            scope.endYear = endData.year;
            scope.endWeeks = endData.weeks;
          }
        };
        if (!scope.shouldRefresh) {
          init();
        }
      }
    };
  }]);
})();
