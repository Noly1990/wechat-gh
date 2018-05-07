-- set GLOBAL event_scheduler = ON; 
set time_zone = '+8:00'; 

use ghdata;

drop event if exists resetAttend;

create event resetAttend

on schedule every 1 day starts timestamp '2014-07-30 10:00:00'

do update users set daily_attendance=1 where daily_attendance=0; 

