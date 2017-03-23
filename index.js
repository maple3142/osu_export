const fs=require('fs-extra');
const path=require('path');
const parser=require('osu-parser');
const id3=require('node-id3');
const args=process.argv.slice(2);
function pcatch(e){}
if(args.length>1){
    fs.readdir(args[0],(err,dirs)=>{
        if(err)return;
        console.log('total: '+dirs.length);
        var cnt=0;
        dirs.forEach(d=>{
            var dx=path.join(args[0],d);
            fs.stat(dx,(err,stat)=>{
                if(err)return;
                if(stat.isDirectory()){
                    fs.readdir(dx,(err,files)=>{
                        if(err)return;
                        files.some(f=>{
                            if(f.endsWith('.osu')){
                                parser.parseFile(path.join(dx,f),(err,bm)=>{
                                    if(err)return;
                                    var name=args.slice(1).join('');
                                    name=name.replace(/\{Creator}|\{Artist}|\{Title}|\{TitleUnicode}|\{AudioFilename}|\{Source}/gi,match=>{
                                        switch(match){
                                            case '{Creator}':
                                                return bm.Creator;
                                            case '{Artist}':
                                                return bm.Artist;
                                            case '{Title}':
                                                return bm.Title;
                                            case '{TitleUnicode}':
                                                return bm.TitleUnicode||bm.Title;
                                            case '{AudioFilename}':
                                                return bm.AudioFilename;
                                            case '{Source}':
                                                return bm.Source||bm.Title;
                                        }
                                    });
                                    var source=path.join(dx,bm.AudioFilename);
                                    var dest=path.join(__dirname,'./output',name);
                                    try{
                                        fs.copySync(source,dest);
                                    }catch(e){

                                    }
                                    id3.write({
                                        artist: bm.Artist,
                                        title: bm.TitleUnicode||bm.Title,
                                        album: ''
                                    },dest);
                                    cnt++;
                                    if(cnt%100==0)console.log('processing: '+cnt);
                                });
                                return true;
                            }
                        });
                    });
                }
            });
        });
    });
}
else
    console.log('error');