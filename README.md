# dateranger-picker
angular material dateranger-picker

### [demo](http://blog.0xfc.cn/2015/08/20/daterange-picker/) ###
> ![demo](http://7xl1b4.com1.z0.glb.clouddn.com/material-daterangepicker.png)

**demo**

> demo/index.html

**dependencies**
> daterange-picker depends on angular 1.3.15, angular material ~0.10.0, moment ~2.10.3 as bower.json says.

**install**
> `bower install dateranger-picker --save`

**how to use**

> in you index.html include daterangepicker.js and daterangepicker.css
> `app.module('your angular app name', 'fc.dateRange')`

**use like this**

> `<daterange-picker dateLang: '@' dateLabel: '@'  startDate: '=' endDate: '=?' minDate: '@' maxDate: '@' dateType: '@' dateLength: '=?' confirm-event='&?'>
</daterange-picker>`

**params**
> date-lang: language. Use 'cn' for Chinese, 'en' for English. Default is 'en'.
> 
> date-label: label. Default ''.
> 
> date-type: 'range' or none. If you want to use this component for daterange-picker, you should set 'range'. If none, this is a just date-picker.
>  
> start-date:  Start Date if date-type is 'range'. Select Date if date-type is none.
>  
> end-date: End Date if date-type is 'range'. Useless if date-type is none.
>   
> max-date & min-date: Min Date and Max Date that can select. Such as '2015-07-08'.
>  
> date-length: diff between start-date and end-date.
>
> confirm-event: callback when click confirm button.

**important**

> All the Date Format is "YYYY-MM-DD"
