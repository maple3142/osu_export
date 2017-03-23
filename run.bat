@echo off
set /p p=osu!/Songs path:= 
if (%p%) == () set p=%AppData%/../local/osu!/Songs
set /p name=name format({Creator} {Artist} {Title} {TitleUnicode} {AudioFilename} {Source})= 
if (%name%) == () set name={TitleUnicode}.mp3
node index.js %p% %name%
echo end!
pause