const Discord = require("discord.js");
const bot = new Discord.Client();
const mysql = require("mysql");
const token = "NzA0OTgxODA1NjgxNDc1NTg1.Xuyosg._UyFaUonfuqyDClYEFAXaZw2E0o";
const worldname = "worldname";
const botname = "botname";
const date = new Date();
var prefix = "!rpg";
const channelid = "704982182904594474";

var defaultmagehp = 90;
var defaultassassinhp = 80;
var defaulttankhp = 120;

var con = mysql.createConnection({
    host: "localhost",
    user: "waa",
    password: "12345",
    database: "game",
})

var status = 0;
var monstername = "";

con.connect(err =>{
    if (err) throw err;
    console.log("Database working.");
})

bot.on("ready",() =>{
    console.log("Running.");
})

function generateExp(){
    let min = 5;
    let max = 10;
    return Math.floor(Math.random() * max + min);
}


/*
function fightExpire(name){
    bot.on("message",message =>{
        message.channel.send("The monster has run away from "+name+".\nThe Fight has been expired since it took too long.")
    })
}
*/


bot.on("message",message =>{

    var day = date.getDate();
    var month = date.getMonth();
    month+=1
    var events = ["davys-petshop","fishing-pond"]

    let args = message.content.split(" ");
    
    if (message.author.id!="704981805681475585"){
        var eventname = "none";
        
        if (day == 25){
            eventname = "Davys Petshop";
        }

        else if (day == 28 || day == 14 || day == 12 || day == 17 || day == 23 || day == 5 || day == 29 || day == 20 || day == 2){
            eventname = "Fishing Pond";
        }

        else{
            
            if (message.author.id!="704981805681475585"){
                for (i=0;i<events.length;i++)
                {
                    if (events[i]==message.channel.name){
                        message.channel.delete();
                    }
                }
            }
            eventname="none";
        }

        if (eventname=="none"){
            var delallevents = "DELETE FROM event";
            con.query(delallevents);
        }
        con.query("SELECT * FROM event",(err,rows) =>{
            if (rows.length<1){
                if (eventname!="none"){
                    message.channel.send("@everyone, new event has started!\nType **"+prefix+" help** in the new channel to see commands.");
                    var makeneweventsql= "INSERT INTO event (name) VALUES ('"+eventname+"')";
                    con.query(makeneweventsql);
                    message.guild.channels.create(eventname,"text");
                }
                
            }
        })
        
        con.query("SELECT * FROM fightstat WHERE name = '"+message.author.id+"'",(err0,rows0) =>{
            
            if (err0) throw err0;
            if (rows0.length>0){
                var stat = rows0[0].status;
                if (stat==3){
                    if (args[0]!=prefix){
                        message.reply("Either use the fighting arena by typing **"+prefix+" accept** or make it available for others by doing **"+prefix+" deny**.");
                    }
                }
            }
        })

        con.query("SELECT * FROM garden WHERE user = '"+message.author.id+"'",(err2,rows2) =>{
            if (err2) throw err2;
            if (rows2.length>=1){
                for (i=0;i<rows2.length;i++){
                    var seedname = rows2[i].seedname;
                    var dayplanted = rows2[i].dayplanted;
                    var monthplanted = rows2[i].monthplanted;
                    var dayspassed = rows2[i].dayspassed;
                    var daystoharvest = rows2[i].daystoharvest;
                    var harvest = rows2[i].harvest;
                    var quantity = rows2[i].quantity;
                    var day = date.getDate();
                    var month = date.getMonth();
                    if (day!=dayplanted){
                        if ((dayspassed+1)==daystoharvest){
                            con.query("SELECT * FROM item WHERE number = "+harvest,(err3,rows3) =>{
                                if (err3) throw err3;
                                var itemname = rows3[0].name;
                                message.reply("Congrats, you got **"+quantity+" "+itemname+"**.");
                                var deltheplantsql = "DELETE FROM garden WHERE user = '"+message.author.id+"' AND seedname = '"+seedname+"' AND daystoharvest = '"+(dayspassed+1)+"'LIMIT 1";
                                con.query(deltheplantsql);
                                var itemnumber = harvest;
                                con.query("SELECT * FROM item WHERE number = "+itemnumber,(err13,rows13) =>{
                                    if (err13) throw err13;
                                    con.query("SELECT * FROM storage WHERE user = '"+message.author.id+"'",(err6,rows6) =>{
                                        if (err6) throw err6;
                                        if (rows6.length<1){
                                            con.query("SELECT * FROM item WHERE number = "+itemnumber+"",(err14,rows14) =>{
                                                if (err14) throw err14;
                                                var itemsname = rows14[0].name;
                                                var sql = "INSERT INTO storage VALUES ('"+message.author.id+"','"+itemnumber+"','"+itemsname+"',1,1)";
                                                con.query(sql);
                                                con.query("SELECT * FROM inventory WHERE id = '"+message.author.id+"'",(err12,rows12) =>{
                                                    if (err12) throw err12;
                                                
                                                    var itemsininventory = rows12[0].items;
                                                    if (itemsininventory==null){
                                                        var newlistofitems = itemnumber;
                                                    }
                                                    else{
                                                        var newlistofitems = itemsininventory+","+itemnumber;
                                                    }
                                                    var sql2 = "UPDATE inventory set items='"+newlistofitems+"' WHERE id = '"+message.author.id+"'";
                                                    console.log("newlistofitems: "+newlistofitems);
                                                    con.query(sql2);
                                                })
                                            })
                                        }
                                        else{
                                            con.query("SELECT * FROM storage WHERE user = '"+message.author.id+"' AND item ="+itemnumber,(err7,rows7) =>{
                                                if (err7) throw err7;
                                                if (rows7.length<1){
                                                    
                                                    con.query("SELECT * FROM item WHERE number = "+itemnumber+"",(err14,rows14) =>{
                                                        con.query("SELECT * FROM storage WHERE user = '"+message.author.id+"'",(err15,rows15) =>{
                                                            var rowsintable = rows15.length;
                                                            if (err14) throw err14;
                                                            var itemsname = rows14[0].name;
                                                            var sql = "INSERT INTO storage VALUES ('"+message.author.id+"','"+itemnumber+"','"+itemsname+"',1,1)";
                                                            if (rowsintable>=7){
                                                                sql = "INSERT INTO storage VALUES ('"+message.author.id+"','"+itemnumber+"','"+itemsname+"',1,2)";
                                                            }
                                                            else if (rowsintable>=14){
                                                                sql = "INSERT INTO storage VALUES ('"+message.author.id+"','"+itemnumber+"','"+itemsname+"',1,3)";
                                                            }
                                                            else if (rowsintable>=21){
                                                                sql = "INSERT INTO storage VALUES ('"+message.author.id+"','"+itemnumber+"','"+itemsname+"',1,4)";
                                                            }
                                                            else if (rowsintable>=28){
                                                                sql = "INSERT INTO storage VALUES ('"+message.author.id+"','"+itemnumber+"','"+itemsname+"',1,5)";
                                                            }
                                                            else if (rowsintable>=35){
                                                                sql = "INSERT INTO storage VALUES ('"+message.author.id+"','"+itemnumber+"','"+itemsname+"',1,6)";
                                                            }
                                                            else if (rowsintable>=42){
                                                                sql = "INSERT INTO storage VALUES ('"+message.author.id+"','"+itemnumber+"','"+itemsname+"',1,7)";
                                                            }
                                                            con.query(sql);
                                                            con.query("SELECT * FROM inventory WHERE id = '"+message.author.id+"'",(err9,rows9) =>{
                                                                if (err9) throw err9;
                                                            
                                                                var itemsininventory = rows9[0].items;
                                                            
                                                                var newlistofitems = itemsininventory+","+itemnumber;
                                                                var sql2 = "UPDATE inventory set items='"+newlistofitems+"' WHERE id = '"+message.author.id+"'";
                                                                console.log("newlistofitems: "+newlistofitems);
                                                                con.query(sql2);
                                                            })
                                                        })
                                                    })
                                                    
                                                }
                                                else{
                                                    var newitemquantity = ((rows7[0].quantity) + 1);
                                                    var sql = "UPDATE storage SET quantity ="+newitemquantity+" WHERE user = '"+message.author.id+"' AND item ="+itemnumber;
                                                    con.query(sql);
                                                }
                                            })
                                        }
                                    })
                                })
                            })
                        }
                        else{
                            var updatethisone = "UPDATE garden SET dayplanted = "+day+" WHERE user ='"+message.author.id+"' AND seedname = '"+seedname+"'";
                            con.query(updatethisone);
                            var updatethatone = "UPDATE garden SET dayspassed = "+(dayspassed+1)+" WHERE user ='"+message.author.id+"' AND seedname = '"+seedname+"'";
                            con.query(updatethatone);
                        }
                    }
                    else{
                        if (month!=monthplanted){
                            if ((dayspassed+1)==daystoharvest){
                                con.query("SELECT * FROM item WHERE number = "+harvest,(err3,rows3) =>{
                                    if (err3) throw err3;
                                    var itemname = rows3[0].name;
                                    message.reply("Congrats, you got **"+quantity+" "+itemname+"**.");
                                })
                            }
                            else{
                                var updatethatone = "UPDATE garden SET dayspassed = "+(dayspassed+1)+" WHERE user ='"+message.author.id+"' AND seedname = '"+seedname+"'";
                                con.query(updatethatone);
                                var updatethisone = "UPDATE garden SET monthplanted = "+month+" WHERE user ='"+message.author.id+"' AND seedname = '"+seedname+"'";
                                con.query(updatethisone);
                            }
                        }
                        //else{
                           //message.reply("Need **"+(daystoharvest-dayspassed)+"** days till harvest.");
                        //}
                    }
                }
            }
        })
    }

    con.query("SELECT * FROM user WHERE name = '"+message.author.id+"'",(err,rows) =>{
        if (err) throw err;
        let sql;
        let sql2;
        let sql3;
        
            
        if (rows.length < 1){
            
            if (message.author.id!="704981805681475585"){
                message.reply("Welcome to "+worldname+", I am your guide "+botname+".\n Type **"+prefix+" help** to see list of commands.");
                sql = "INSERT INTO user (name,exp,level) VALUES ('"+message.author.id+"',"+generateExp()+",1)";
                sql2 = "INSERT INTO inventory (id,name,crystals) VALUES ('"+message.author.id+"','"+message.author.username+"',0)";
                con.query(sql2);
            }
        }
        else{
            var xp = rows[0].exp;
            var currlevel = rows[0].level;
            var newxp = xp+generateExp();
            var role = rows[0].role;

            updatenamesql = "UPDATE inventory SET name = '"+message.author.username+"' WHERE id = '"+message.author.id+"'";
            con.query(updatenamesql);

            if (role=="mage"){
                var hpofperson = defaultmagehp;
            }

            else if (role=="assassin"){
                var hpofperson = defaultassassinhp;
            }

            else if (role=="tank"){
                var hpofperson = defaulttankhp;
            }

            else{
                var hpofperson = 0;
            }

            if (newxp<250){
                sql = "UPDATE user SET exp = "+newxp+" WHERE name = '"+message.author.id+"'";
            }
            else{
                var newlevel = currlevel+1
                if (newlevel>25){
                    hpofperson+=100;
                    if (newlevel>50){
                        hpofperson+=100;
                        if (newlevel>75){
                            hpofperson+=100;
                            if (hpofperson>100){
                                hpofperson+=150;
                            }
                        }
                    }
                }
                sql = "UPDATE user SET exp = 0, level = "+newlevel+" WHERE name = '"+message.author.id+"'";
               
                sql3 = "UPDATE fightstat set hp ="+(hpofperson+newlevel)+" WHERE name = '"+message.author.id+"'";
                con.query(sql3);
               
                if ((newlevel%5)==0){
                    message.reply("You have advanced to level "+newlevel+".\nCongratulations soldier, You serve the kingdom right.");
                }
               
            }
        }
        
        
        if (sql!=null){
            con.query(sql);
        }
    }); 
    con.query("SELECT * FROM event",(err0,rows0) =>{
        if (err0) throw err0;
        if (rows0.length>=1){
            var eventname = rows0[0].name;
            if (message.author.id!="704981805681475585" && message.channel.name == "fishing-pond" && eventname == "Fishing Pond"){
                if (args[0].toLowerCase()=="fish"){
                    con.query("SELECT * FROM fishing",(err,rows) =>{
                        if (err) throw err;
                        var len = rows.length;
                        var fishrand = Math.floor(Math.random() * len);
                        if (rows[fishrand].fishname=="Crystal"){
                            var numberofcrystals = Math.floor(Math.random() * 30);
                            message.reply("You got a purse which had **"+numberofcrystals+"** crystals in it.");
                            con.query("SELECT * FROM inventory WHERE id = '"+message.author.id+"'",(err1,rows1) =>{
                                if (err1) throw err1;
                                var currentamount = rows1[0].crystals;
                                var updatecrystalssql = "UPDATE inventory SET crystals = "+(currentamount+numberofcrystals)+" WHERE id = '"+message.author.id+"'";
                                con.query(updatecrystalssql);
                            })
                        }
                        else{
                            var chance = rows[fishrand].chancetoget;
                            var itemnumber = rows[fishrand].itemno;
                            var luck = Math.floor(Math.random() * chance + 1);
                            if (luck == 1){
                                message.reply("You have succefully caught a **"+rows[fishrand].fishname+"**.");
                                con.query("SELECT * FROM item WHERE number = "+itemnumber,(err13,rows13) =>{
                                    if (err13) throw err13;
                                    var itemname = rows13[0].name;
                                    con.query("SELECT * FROM storage WHERE user = '"+message.author.id+"'",(err6,rows6) =>{
                                        if (err6) throw err6;
                                        if (rows6.length<1){
                                            con.query("SELECT * FROM item WHERE number = "+itemnumber+"",(err14,rows14) =>{
                                                if (err14) throw err14;
                                                var itemsname = rows14[0].name;
                                                var sql = "INSERT INTO storage VALUES ('"+message.author.id+"','"+itemnumber+"','"+itemsname+"',1,1)";
                                                con.query(sql);
                                                con.query("SELECT * FROM inventory WHERE id = '"+message.author.id+"'",(err12,rows12) =>{
                                                    if (err12) throw err12;
                                                
                                                    var itemsininventory = rows12[0].items;
                                                    if (itemsininventory==null){
                                                        var newlistofitems = itemnumber;
                                                    }
                                                    else{
                                                        var newlistofitems = itemsininventory+","+itemnumber;
                                                    }
                                                    var sql2 = "UPDATE inventory set items='"+newlistofitems+"' WHERE id = '"+message.author.id+"'";
                                                    console.log("newlistofitems: "+newlistofitems);
                                                    con.query(sql2);
                                                })
                                            })
                                        }
                                        else{
                                            con.query("SELECT * FROM storage WHERE user = '"+message.author.id+"' AND item ="+itemnumber,(err7,rows7) =>{
                                                if (err7) throw err7;
                                                if (rows7.length<1){
                                                    
                                                    con.query("SELECT * FROM item WHERE number = "+itemnumber+"",(err14,rows14) =>{
                                                        con.query("SELECT * FROM storage WHERE user = '"+message.author.id+"'",(err15,rows15) =>{
                                                            var rowsintable = rows15.length;
                                                            if (err14) throw err14;
                                                            var itemsname = rows14[0].name;
                                                            var sql = "INSERT INTO storage VALUES ('"+message.author.id+"','"+itemnumber+"','"+itemsname+"',1,1)";
                                                            if (rowsintable>=7){
                                                                sql = "INSERT INTO storage VALUES ('"+message.author.id+"','"+itemnumber+"','"+itemsname+"',1,2)";
                                                            }
                                                            else if (rowsintable>=14){
                                                                sql = "INSERT INTO storage VALUES ('"+message.author.id+"','"+itemnumber+"','"+itemsname+"',1,3)";
                                                            }
                                                            else if (rowsintable>=21){
                                                                sql = "INSERT INTO storage VALUES ('"+message.author.id+"','"+itemnumber+"','"+itemsname+"',1,4)";
                                                            }
                                                            else if (rowsintable>=28){
                                                                sql = "INSERT INTO storage VALUES ('"+message.author.id+"','"+itemnumber+"','"+itemsname+"',1,5)";
                                                            }
                                                            else if (rowsintable>=35){
                                                                sql = "INSERT INTO storage VALUES ('"+message.author.id+"','"+itemnumber+"','"+itemsname+"',1,6)";
                                                            }
                                                            else if (rowsintable>=42){
                                                                sql = "INSERT INTO storage VALUES ('"+message.author.id+"','"+itemnumber+"','"+itemsname+"',1,7)";
                                                            }
                                                            con.query(sql);
                                                            con.query("SELECT * FROM inventory WHERE id = '"+message.author.id+"'",(err9,rows9) =>{
                                                                if (err9) throw err9;
                                                            
                                                                var itemsininventory = rows9[0].items;
                                                            
                                                                var newlistofitems = itemsininventory+","+itemnumber;
                                                                var sql2 = "UPDATE inventory set items='"+newlistofitems+"' WHERE id = '"+message.author.id+"'";
                                                                console.log("newlistofitems: "+newlistofitems);
                                                                con.query(sql2);
                                                            })
                                                        })
                                                    })
                                                    
                                                }
                                                else{
                                                    var newitemquantity = ((rows7[0].quantity) + 1);
                                                    var sql = "UPDATE storage SET quantity ="+newitemquantity+" WHERE user = '"+message.author.id+"' AND item ="+itemnumber;
                                                    con.query(sql);
                                                }
                                            })
                                        }
                                    })
                                })

                            }
                        }
                    })
                }
            }
        }
    })
    
    if (args[0]!=prefix){
        if (message.author.id!="704981805681475585" && message.channel.name != "fishing-pond"){
            con.query("SELECT * FROM user WHERE name = '"+message.author.id+"'",(err,rows) =>{
                if (rows.length!=0){
                    if (err) throw err;
                    
                    var userlevel = rows[0].level;
                    
                    let min = 1;
                    let max = 275; //was 300
                    var popped = 0;
                    number = Math.floor(Math.random() * max + min);

                    if (number>1 && number<10 && popped == 0){
                        popped = 1;
                        monstername = "Slime";
                        status = 1;
                        const embed = new Discord.MessageEmbed()
                        .setTitle("Monster lurking around the walls!")
                        .setDescription("Kill Monster to get EXP,Items and Crystals!")
                        .addField("Monster Name",monstername)
                        .addField("Difficulty","E")
                        .setColor("#FFFF99")
                        .setThumbnail("https://pbs.twimg.com/media/CSneQdtUEAAoWJf.jpg:large");
                        message.channel.send(embed);
                    }

                    else if (number>=10 && number<13 || number==30 || number == 31 && popped == 0){
                        popped = 1;
                        monstername = "Lizardman";
                        status = 1;
                        const embed = new Discord.MessageEmbed()
                        .setTitle("Monster lurking around the walls!")
                        .setDescription("Kill Monster to get EXP, Items and Crystals!")
                        .addField("Monster Name",monstername)
                        .addField("Difficulty","D")
                        .setColor("#FFFF00")
                        .setThumbnail("https://giantbomb1.cbsistatic.com/uploads/scale_small/1/17172/1038728-lizalfos0.jpg");
                        message.channel.send(embed);
                    }
                    
                    else if (number>=13 && number<16 || number==28 || number == 29 && popped == 0){
                        popped = 1;
                        monstername = "Wolf";
                        status = 1;
                        const embed = new Discord.MessageEmbed()
                        .setTitle("Monster lurking around the walls!")
                        .setDescription("Kill Monster to get EXP, Items and Crystals!")
                        .addField("Monster Name",monstername)
                        .addField("Difficulty","D")
                        .setColor("#00003f")
                        .setThumbnail("https://i7.pngguru.com/preview/952/449/172/gray-wolf-black-wolf-drawing-monster-wolf-cartoon.jpg");
                        message.channel.send(embed);
                    }

                    else if (number>=16 && number<26 && popped == 0){
                        popped = 1;
                        monstername = "Cursed Rabbit";
                        status = 1;
                        const embed = new Discord.MessageEmbed()
                        .setTitle("Monster lurking around the walls!")
                        .setDescription("Kill Monster to get EXP, Items and Crystals!")
                        .addField("Monster Name",monstername)
                        .addField("Difficulty","E")
                        .setColor("#F9CECE")
                        .setThumbnail("https://www.kindpng.com/picc/m/41-419679_transparent-rabbit-png-transparent-evil-rabbit-png-png.png");
                        message.channel.send(embed);
                    }

                    else if (number==26 ||number == 27 && popped == 0){
                        popped = 1;
                        monstername = "Bandit";
                        status = 1;
                        const embed = new Discord.MessageEmbed()
                        .setTitle("A bandit has been caught lurking around the walls!")
                        .setDescription("Kill Bandit to get EXP, Items and Crystals!")
                        .addField("Monster Name",monstername)
                        .addField("Difficulty","A")
                        .setColor("#2C2F33")
                        .setThumbnail("https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/51158316-fd7e-48ca-b5fe-8542e9dfe357/dblwftj-21e75815-371a-4dec-8ca4-aeb96b32fe17.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3sicGF0aCI6IlwvZlwvNTExNTgzMTYtZmQ3ZS00OGNhLWI1ZmUtODU0MmU5ZGZlMzU3XC9kYmx3ZnRqLTIxZTc1ODE1LTM3MWEtNGRlYy04Y2E0LWFlYjk2YjMyZmUxNy5wbmcifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6ZmlsZS5kb3dubG9hZCJdfQ.eYeXt-LjC6KyLYreLERc0iTAL5UIi6yzVEr2NlUGMuk");
                        message.channel.send(embed);
                    }

                    else if ( number == 32 || number == 33 || number == 34  && popped == 0){
                        popped = 1;
                        monstername = "Goblin";
                        status = 1;
                        const embed = new Discord.MessageEmbed()
                        .setTitle("Monster lurking around the walls!")
                        .setDescription("Kill Monster to get EXP, Items and Crystals!")
                        .addField("Monster Name",monstername)
                        .addField("Difficulty","B")
                        .setColor("#228B22")
                        .setThumbnail("https://img.favpng.com/1/13/16/hobgoblin-orc-monster-elf-png-favpng-LrLnZ615VnF9NFjcEBrpEsgda.jpg");
                        message.channel.send(embed);
                    }

                    else if ( number == 35 || number == 36 || number == 37 || number == 38  && popped == 0){
                        popped = 1;
                        monstername = "Zombie";
                        status = 1;
                        const embed = new Discord.MessageEmbed()
                        .setTitle("Monster lurking around the walls!")
                        .setDescription("Kill Monster to get EXP, Items and Crystals!")
                        .addField("Monster Name",monstername)
                        .addField("Difficulty","C")
                        .setColor("#6a0dad")
                        .setThumbnail("https://i.pinimg.com/originals/db/6c/ce/db6ccebffed0da50cbafb8b895673ead.png");
                        message.channel.send(embed);
                    }

                    else if (number == 69 && userlevel>=50){
                        popped = 1;
                        monstername = "Black Dragon";
                        status = 1;
                        const embed = new Discord.MessageEmbed()
                        .setTitle("Monster lurking around the walls!")
                        .setDescription("Kill Monster to get EXP, Items and Crystals!")
                        .addField("Monster Name",monstername)
                        .addField("Difficulty","S")
                        .setColor("#000000")
                        .setThumbnail("https://p7.hiclipart.com/preview/849/395/771/dragon-monster-legendary-creature-charizard-illustration-download-and-use-dragon-png-clipart.jpg");
                        message.channel.send(embed);
                    }
                }
            })
        }
    }   
    
    else if (args[0]==prefix){
        switch(args[1]){

            default:
                message.channel.send("Type **"+prefix+" help** to see commands.");
                break;

            case "help":

                if (message.channel.name == "davys-petshop" ){
                    const embed = new Discord.MessageEmbed()
                    .setTitle("Command for "+eventname+" event.")
                    .setDescription("Here are a list of extra commands for this event:")
                    .addField(prefix + " petshop","Shows the pets available in the pet shop event.",true)
                    .addField(prefix + " petbuy","Command to buy a specified pet.",true)
                    .setColor("#add8e6")
                    .setThumbnail(message.author.avatarURL);
                    message.channel.send(embed);
                }

                else if (message.channel.name == "fishing-pond"){
                    const embed = new Discord.MessageEmbed()
                    .setTitle("Command for "+eventname+" event.")
                    .setDescription("Here is the only extra command for this event:")
                    .addField("fish","Type this for a chance to get something.. or spam.",true)
                    .setColor("#add8e6")
                    .setThumbnail(message.author.avatarURL);
                    message.channel.send(embed);
                }

                else{
                    const embed = new Discord.MessageEmbed()
                    .setTitle("Welcome to the world of "+worldname+"!",message.author.username)
                    .setDescription("Here are a list of commands:")
                    .addField(prefix + " roles","Shows the roles in the game.  The earlier you choose a role, the better.",true)
                    .addField(prefix + " exp","Shows current exp of player and exp needed to advance to the next level.",true)
                    .addField(prefix + " fight","Used to fight the monster that has recently appeared.",true)
                    .addField(prefix + " mymoves","Moves that are currently learnt/equipped and can be used in battle.",true)
                    .addField(prefix + " moves","Available moves for the chosen role.",true)
                    .addField(prefix + " learn","Shows current exp of player and exp needed to advance to the next level.",true)
                    .addField(prefix + " inventory","Shows items owned.",true)
                    .addField(prefix + " share","Used to share items to each other.",true)
                    .addField(prefix + " info","Used to get details on a move or item.",true)
                    .addField(prefix + " consume *itemnumber*","Command to consume a consumable item.",true)
                    .setColor("#add8e6")
                    .setThumbnail(message.author.avatarURL);
                    message.channel.send(embed);
                }    

                break;

            case "exp":
            case "xp":
                
                con.query("SELECT * FROM user WHERE name = '"+message.author.id+"'",(err,rows) =>{
                    if (rows.length<1){
                        message.reply("New to the game? Say hello!");
                    }
                    else{
                        var xp = rows[0].exp;
                        var level = rows[0].level;
                        message.reply("You have "+xp+" exp. You need "+(250-xp)+" exp to reach "+(level+1)+".");
                    }
                })
                break;

            case "lvl":
            case "level":

                con.query("SELECT * FROM user WHERE name = '"+message.author.id+"'",(err,rows) =>{
                    if (rows.length<1){
                        message.reply("New to the game? Say hello!");
                    }
                    else{
                        var xp = rows[0].exp;
                        var level = rows[0].level;
                        message.reply("You are level **"+(level)+"**.");
                    }
                })
                break;
            case "fight":
                con.query("SELECT * FROM user WHERE name = '"+message.author.id+"'",(er,row) =>{
                    if (er) throw (er);
                    var urole = row[0].role;
                    if (urole == null){
                        message.reply("Please choose a role before you start a fight.");
                    }
                    else{
                
                        if (status==0){
                            message.reply("No monsters around you at the moment.");
                        }
                        else{
                            con.query("SELECT * FROM fightstat WHERE name = '"+message.author.id+"'",(err,rows) =>{
                                if (err) throw err;
                                var sta = rows[0].status;
                                var uhp = rows[0].hp;
                                if (sta==0 && uhp!=0){
                                    
                                    con.query("SELECT * FROM user WHERE name = '"+message.author.id+"'",(err0,rows0) =>{
                                        if (err0) throw err0;
                                        if (rows0[0].role==null){
                                            message.reply("You do not have a role at the moment. Please choose a role first by typing **"+prefix+" roles**");
                                        }
                                        else{
                                            message.reply("has started to fight "+monstername+".");
                                            let sql = "UPDATE fightstat SET status = 1 WHERE name = '"+message.author.id+"'";                    
                                            con.query(sql);
                                            con.query("SELECT * FROM usermove WHERE user = '"+message.author.id+"'",(err,rows) =>{
                                                if (!rows.length<1){
                                                
                                                    con.query("SELECT * FROM monsterinfo WHERE name = '"+monstername+"'",(err1,rows1) =>{
                                                        var hp = rows1[0].hp;
                                                        let deloldsql = "DELETE FROM currentfight WHERE user = '"+message.author.id+"'";
                                                        con.query(deloldsql);
                                                        let newestssql = "INSERT INTO currentfight (user,monster,monsterhp) VALUES ('"+message.author.id+"','"+monstername+"',"+hp+")";
                                                        con.query(newestssql);
                                                    })
                                                    if (err) throw err;
                                                    var movesavailable = rows[0].move;
                                                    var moves = movesavailable.split(",");
                                                    const embed = new Discord.MessageEmbed()
                                                    .setTitle(message.author.username+" VS "+monstername)
                                                    .setDescription("Choose a move from your current moves by typing **"+prefix+" do/chant/choose *movenumber* **.")
                                                    .setColor("#add8e6")
                                                    .setThumbnail(message.author.avatarURL);
                                                    for (i=0;i<moves.length;i++){
                                                        embed.addField("Move "+(i+1)+":",moves[i],true);
                                                    }     
                                                    message.reply(embed);
                                                    
                                                    
                                                }
                                            })
                                        }
                                    })
                                }
                                
                                else if(uhp==0){
                                    message.reply("You are still critically wounded. Level up to recover.");
                                }

                                else{
                                    message.reply("You are currently busy in a fight.");
                                }
                            })
                        }
                    }
                })
            
            
                break;
            case "roles":
            case "role":
                con.query("SELECT * FROM user WHERE name = '"+message.author.id+"'",(err,rows) =>{
                    var role = rows[0].role;
                    
                    if (role==null){
                        const embed = new Discord.MessageEmbed()
                        .setTitle("Roles")
                        .setDescription("Choose a role from available roles, "+message.author.username+".\n**Roles cannot be changed, choose wisely.**")
                        .addField("***Mage***","Able to conjure the elements nature itself, low hp but decent damage.\nType **"+prefix+" mage** to select this role")
                        .addField("***Assassin***","Assassins deal excellent damage but can only take less.\nType **"+prefix+" assassin** to select this role")
                        .addField("***Tank***","Tanks can take tons of damage but give less.\nType **"+prefix+" tank** to select this role")
                        .setColor("#add8e6")
                        .setThumbnail(message.author.avatarURL);
                        message.channel.send(embed);
                    }
                    else{
                        message.reply("your current role is "+role);
                    }
                })
                break;
            case "mage":
                var sql;
                var sql2;
                var sql3;
                var sql4;
                con.query("SELECT * FROM user WHERE name = '"+message.author.id+"'",(err,rows) =>{
                    var role = rows[0].role;
                    
                    if (role==null){
                        const embed = new Discord.MessageEmbed()
                        .setTitle("You have chosen to become a Mage!")
                        .setDescription("Mages deal good damage and is versatile in fights.")
                        .setColor("#68a0b0")
                        .setThumbnail("https://toppng.com/uploads/preview/spirit-runes-circle-symbol-magic-circle-alchemy-symbols-wheel-11562967782ylwkmn5fqn.png");
                        message.reply(embed);
                        sql = "UPDATE user SET role = 'mage' WHERE name = '"+message.author.id+"'";
                        sql2 = "INSERT INTO usermove values ('"+message.author.id+"','Poke,Poke,Poke,Poke,Poke,Poke,Poke,Poke,Poke,Poke')";
                        sql3 = "INSERT INTO fightstat  VALUES ('"+message.author.id+"',90,0,0,1,0)";
                        sql4 = "INSERT INTO gear (user,mainweapon,attire) VALUES ('"+message.author.id+"','Common Staff','Ragged Clothes')";
                        con.query(sql);
                        con.query(sql2);
                        con.query(sql3);
                        con.query(sql4);
                    }

                    else{
                        message.reply("You already have a role. You are a/an "+role);
                    }
                })
                
                break;
            
            case "assassin":
                var sql;
                var sql2;
                var sql3;
                var sql4;
                con.query("SELECT * FROM user WHERE name = '"+message.author.id+"'",(err,rows) =>{
                    var role = rows[0].role;
                    
                    if (role==null){
                        const embed = new Discord.MessageEmbed()
                        .setTitle("You have chosen to become an Assassin!")
                        .setDescription("Assassins can finish fights quickly. Make sure you're not the losing side!")
                        .setColor("#ff0000")
                        .setThumbnail("https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTJA9BLRpnc1e7VzO0bvHVJlhjrU93A6Nl4626CcsW4PCgVXcLr&usqp=CAU");
                        message.reply(embed);
                        sql = "UPDATE user SET role = 'assassin' WHERE name = '"+message.author.id+"'";
                        sql2 = "INSERT INTO usermove values ('"+message.author.id+"','Stab,Stab,Stab,Stab,Stab,Stab,Stab,Stab,Stab,Stab')";
                        sql3 = "INSERT INTO fightstat  VALUES ('"+message.author.id+"',80,0,0,1,0)"
                        sql4 = "INSERT INTO gear (user,mainweapon,attire) VALUES ('"+message.author.id+"','Common Dagger','Ragged Clothes')";
                        con.query(sql);
                        con.query(sql2);
                        con.query(sql3);
                        con.query(sql4);
                    }
    
                    else{
                        message.reply("You already have a role. You are a/an "+role);
                    }
                })
                break;

            case "tank":
                var sql;
                var sql2;
                var sql3;
                var sql4;
                con.query("SELECT * FROM user WHERE name = '"+message.author.id+"'",(err,rows) =>{
                    var role = rows[0].role;
                    
                    if (role==null){
                        const embed = new Discord.MessageEmbed()
                        .setTitle("You have chosen to become a Tank!")
                        .setDescription("Tanks have high defense. Fights last for much longer.")
                        .setColor("#90ee90")
                        .setThumbnail("https://www.netclipart.com/pp/m/55-552404_sword-logo-png-sword-and-shield-symbol.png");
                        message.reply(embed);
                        sql = "UPDATE user SET role = 'tank' WHERE name = '"+message.author.id+"'";
                        sql2 = "INSERT INTO usermove values ('"+message.author.id+"','Swing,Swing,Swing,Swing,Swing,Swing,Swing,Swing,Swing,Swing')";
                        sql3 = "INSERT INTO fightstat  VALUES ('"+message.author.id+"',120,0,0,1,0)";
                        sql4 = "INSERT INTO gear (user,mainweapon,attire) VALUES ('"+message.author.id+"','Common Shield','Ragged Clothes')";
                        con.query(sql);
                        con.query(sql2);
                        con.query(sql3);
                        con.query(sql4);
                    }
    
                    else{
                        message.reply("You already have a role. You are a/an "+role);
                    }
                })
                break;

            case "moves":
            case "move":
                con.query("SELECT * FROM user WHERE name = '"+message.author.id+"'",(err1,rows1) =>{
                    var chosen = rows1[0].role;
                    var levelnow = rows1[0].level;
                    if (chosen==null){
                        message.reply("please choose a role first by typing **"+prefix+" roles**");
                    }
                    else if (chosen == "mage" || chosen == "assassin" || chosen == "tank"){
                        con.query("SELECT * FROM roles WHERE role = '"+chosen+"'",(err,rows) =>{
                            if (err) throw err;
                            var move = rows[0].move;
                            var image = rows[0].image;
                            move =  move.split(",");
                            var movearray = [];
                            for (i=0; i<move.length;i++){
                                movearray[i] = move[i];
                            }
                        
                            const embed = new Discord.MessageEmbed()
                            .setTitle("Moves")
                            .setDescription("These are the available moves for your current level.\nLevel 100 unlocks every move.\n**Current level: "+levelnow+"**")
                            .setColor("#68a0b0")
                            .setThumbnail(image);
                            for (i=0; i<movearray.length;i++){
                                
                                var level;
                                    if  (i == 0){
                                    level = 5;  
                                    }
                                    else{
                                        level = i*5+5;
                                    }
                                embed.addField("Level: "+level+":", movearray[i],true);
                            }
                            embed.addField("How to learn: ", "Type **"+prefix+" learn *movename* ** to learn the move.");
                            message.reply(embed);
                        })
                    }
                    
                })
                break;
            case "learn":
                var moveselected = 0; 
                var learnmove;
                con.query("SELECT * FROM user WHERE name = '"+message.author.id+"'",(err1,rows1) =>{
                    var chosen = rows1[0].role;
                    if (chosen==null){
                        message.reply("please choose a role first by typing **"+prefix+" roles**");
                    }
                    else{
                    if (args[2] == null){
                        message.reply("please specify the move you want to learn. Type **"+prefix+" moves** to check all moves for your role.");
                    }

                    else{
                        if(args[3] == null){
                                learnmove = args[2].toLowerCase();
                                moveselected = 1;
                        }

                        else{
                                learnmove = args[2].toLowerCase() +" "+ args[3].toLowerCase();
                                moveselected = 1;

                                if (args[4]!= null){
                                    learnmove = args[2].toLowerCase() +" "+ args[3].toLowerCase() +" "+ args[4].toLowerCase();
                                    moveselected = 1;
                                }
                        }

                        if (moveselected==1){
                                let okvar;
                                con.query("SELECT * FROM roles WHERE role = '"+chosen+"'",(err1,rows1) =>{
                                    var movesinrole = rows1[0].move;
                                    movesinrole =  movesinrole.split(",");
                                    var movearray = [];
                                    for (i=0; i<movesinrole.length;i++){
                                        movearray[i] = movesinrole[i];
                                        var move = movearray[i].replace(/^\s+/,"");;
                                        if (move.toLowerCase() == learnmove){
                                            
                                            let sql; 
                                            sql = "INSERT INTO moveselected VALUES ('"+message.author.id+"','"+learnmove+"')"
                                            sql2 = "DELETE FROM moveselected WHERE name = '"+message.author.id+"'"
                                            con.query("SELECT * FROM usermove WHERE user = '"+message.author.id+"'",(err1,rows1) =>{
                                                var currentmoves = rows1[0].move.split(",");
                                                const embed = new Discord.MessageEmbed()
                                                .setTitle("Your Moves")
                                                .setDescription("Choose a move from your current moves to be replaced, "+message.author.username+".")  
                                                .setColor("#add8e6")
                                                .setThumbnail(message.author.avatarURL);
                                                for (i=0;i<currentmoves.length;i++){
                                                    embed.addField("Move "+(i+1)+":",currentmoves[i],true);
                                                }
                                                embed.addField("How to replace:","Type **"+prefix+" replace movenumber** to do so.");
                                                message.reply(embed);
                                            })
                                            con.query(sql2);
                                            con.query(sql);
                                            okvar = 1;
                                        }
                                    }
                                    if (okvar!=1){
                                        message.reply("The move **"+learnmove+"** does not exist in **"+chosen+"** role.");
                                    }
                                })
                            
                        }
                    }
                    }
                })
                break;

            case "replace":
                con.query("SELECT * FROM moveselected WHERE name = '"+message.author.id+"'",(err,rows) =>{
                    if (err) throw err;
                    if (rows.length==0){
                        message.reply("You have not chosen to learn a move, please do **"+prefix+" learn movename** to choose a move to learn.");
                    }
                    else{
                        var movetolearn = rows[0].movename;
                        if (args[2]==null){
                            message.reply("you have not specified which move to be replaced in order to learn "+movetolearn+".");
                        }
                        else{
                            con.query("SELECT * FROM moveinfo WHERE move = '"+movetolearn+"'",(err1,rows1) =>{
                                if (err1) throw err1;
                                var levelofmove = rows1[0].level;
                                con.query("SELECT * FROM user WHERE name = '"+message.author.id+"'",(err2,rows2) =>{
                                    if (err2) throw err2;
                                    var userlevel = rows2[0].level;
                                    if (levelofmove>userlevel){
                                        message.reply("Your level is too low to learn this skill.");
                                        delsql = "DELETE FROM moveselected WHERE name = '"+message.author.id+"'";
                                        con.query(delsql);
                                    }
                                    else{
                                        con.query("SELECT * FROM usermove WHERE user = '"+message.author.id+"'",(err3,rows3) =>{
                                            if (err3) throw err3;
                                            var usermoves = rows3[0].move.split(",");
                                            var movesarray = [];
                                            var replacedmove;
                                            var j = args[2];
                                            for (i=0;i<usermoves.length;i++){
                                                if ((i+1)==j){
                                                    replacedmove = usermoves[i];
                                                    usermoves[i] = movetolearn;
                                                }
                                                movesarray[i] = usermoves[i];
                                            }
                                            
                                            sql1 = "UPDATE usermove SET move = '"+movesarray+"' WHERE user ='"+message.author.id+"'";
                                            sql2 = "DELETE FROM moveselected WHERE name = '"+message.author.id+"'"
                                            message.reply("you have successfully replaced **"+replacedmove+"** with **"+movetolearn+"**.");
                                            con.query(sql1);
                                            con.query(sql2);
                                        })
                                    }
                                })
                            })
                        }
                    }
                })
                break;
            
            case "do":
            case "chant":
            case "choose": 
                con.query("SELECT * FROM fightstat WHERE name = '"+message.author.id+"'",(err,rows) =>{
                    if (err) throw err;
                    var stat = rows[0].status;
                    var hp = rows[0].hp;
                    var extrahp = rows[0].extrahp;
                    var extraatk = rows[0].extraatk;
                    var multi = rows[0].special;
                    hp += extrahp;
                    if (stat==1){
                        if (args[2]!=null){
                            var multiplier = 1;
                            var endsql = "UPDATE fightstat SET status = 0 WHERE name ='"+message.author.id+"'";
                            if (args[2]>=1 && args[2]<=10){
                                con.query("SELECT * FROM usermove WHERE user = '"+message.author.id+"'",(err1,rows1) =>{
                                    if (err1) throw err1;
                                    var number = args[2]-1;
                                    var usermoves = rows1[0].move.split(",");
                                    var chosenmove = usermoves[number];
                                    con.query("SELECT * FROM moveinfo WHERE move = '"+chosenmove+"'",(err2,rows2) =>{
                                        con.query("SELECT * FROM debuff WHERE user = '"+message.author.id+"'",(errr2,rowss2) =>{
                                            con.query("SELECT * FROM erase WHERE user = '"+message.author.id+"'",(errrr2,rowsss2) =>{
                                                if (errrr2) throw errrr2;
                                                if (errr2) throw errr2;
                                                if (err2) throw err2;
                                                var min = rows2[0].mindmg;
                                                var max = rows2[0].maxdmg;
                                                if (rowss2.length>=1){
                                                    if (chosenmove==rowss2[0].move){
                                                        max=0;
                                                        min=0;
                                                    }
                                                }
                                                if (rowsss2.length>=1){
                                                    for (i=0;i<rowsss2.length;i++){
                                                        if (chosenmove==rowsss2[i].move){
                                                            max=0;
                                                            min=0;
                                                        }
                                                    }
                                                }
                                                var effect = rows2[0].effect;
                                                var maxeffect = rows2[0].chanceeffect;
                                                var mineffect = 1;
                                                var effectnumber = Math.floor(Math.random() * maxeffect + mineffect);
                                                multiplier = rows2[0].multiplier;
                                                if (chosenmove == "blessings of gaia"){
                                                    var min = 1
                                                    var max = 2
                                                    var ran = Math.floor(Math.random() * max + min);
                                                    if (ran == 2){
                                                        multiplier = 0;
                                                    }
                                                    else{
                                                        multiplier = 3;
                                                    }
                                                }

                                                if (effect == "link" && chosenmove == "to the shadows"){
                                                    multiplier = 3;
                                                }
                                                
                                                if (max==0 && min == 0){
                                                    var dmg=0;
                                                }
                                                else{
                                                    var dmg = ((Math.floor(Math.random() * max + min)* multiplier) + extraatk);
                                                }

                                                multipliersql = "UPDATE fightstat SET special ="+multi+" WHERE name = '"+message.author.id+"'";
                                                con.query(multipliersql);
                                                
                                                var dialog = rows2[0].dialog;
                                                
                                                con.query("SELECT * FROM currentfight WHERE user = '"+message.author.id+"'",(err3,rows3) =>{
                                                    if (err3) throw err3;
                                                    var monstername = rows3[0].monster;
                                                    con.query("SELECT * FROM currentfight WHERE monster = '"+monstername+"' AND user= '"+message.author.id+"'",(err11,rows11) =>{
                                                        con.query("SELECT * FROM monsterinfo WHERE name = '"+monstername+"'",(err4,rows4) =>{
                                                            if (err4) throw err4;
                                                            var monsterhp = rows11[0].monsterhp;
                                                            var monstermoves = rows4[0].move;
                                                            var minmoveno = 0;
                                                            monstermoves = monstermoves.split(",");
                                                            var maxmoveno = monstermoves.length-1;
                                                            var monstermovenumber = 0;
                                                            monstermovenumber =  Math.floor(Math.random() * maxmoveno + minmoveno);
                                                            var monstermove = monstermoves[monstermovenumber];
                                                            var monsterccprone = rows4[0].ccprone;
                                                            var randccnumber = Math.floor(Math.random() * monsterccprone + 1);
                                                            if (monsterccprone==0){
                                                                randccnumber = 0;
                                                            }
                                                            if (randccnumber==1){
                                                                monsterccprone = 1;
                                                            }
                                                            var itemdropmin = 1;
                                                            var itemdropmax = rows4[0].itemdropchance;
                                                            var randnumber = Math.floor(Math.random() * itemdropmax + itemdropmin);
                                                            var mincrystal = rows4[0].dropcrystalmin;
                                                            var maxcrystal = rows4[0].dropcrystalmax;
                                                            var crystaldrop = Math.floor(Math.random() *maxcrystal + mincrystal);
                                                            var dropped = 0;
                                                            var maxitems = rows4[0].itemdropnumbers;
                                                            maxitems = maxitems.split(",");
                                                            var maxitemnumber = maxitems.length;
                                                            var minitem = 0
                                                            var randomnumber = Math.floor(Math.random() *maxitemnumber + minitem);
                                                            var itemnumber = maxitems[randomnumber];
                                                            
                                                            if (randnumber==(Math.round(itemdropmax/2))){
                                                                dropped = 1;
                                                            }
                                                            console.log(monstermove);
                                                            con.query("SELECT * FROM moveinfo WHERE move = '"+monstermove+"'",(err5,rows5) =>{
                                                                if (err5) throw err5;
                                                                var monstermindmg = rows5[0].mindmg;
                                                                var monstermaxdmg = rows5[0].maxdmg;
                                                                var monsterdmg = Math.floor(Math.random() * (monstermaxdmg - monstermindmg + 1) + monstermindmg);
                                                                var monsterdialog = rows5[0].dialog;
                                                                var monstereffect = rows5[0].effect;

                                                                if (monstereffect=="debuff"){
                                                                    var deldebuff = "DELETE FROM debuff WHERE user = '"+message.author.id+"'";
                                                                    con.query(deldebuff);
                                                                    var addnewdebuff = "INSERT INTO debuff VALUES ('"+message.author.id+"','"+chosenmove+"')";
                                                                    con.query(addnewdebuff)
                                                                }
                                                                else if (monstereffect=="erase"){
                                                                    var delerase = "DELETE FROM erase WHERE user = '"+message.author.id+"'";
                                                                    con.query(delerase);
                                                                    var adderase = "INSERT INTO erase VALUES ('"+message.author.id+"','"+chosenmove+"')";
                                                                    con.query(adderase)
                                                                }
                                                                else{
                                                                    var deldebuff = "DELETE FROM debuff WHERE user = '"+message.author.id+"'";
                                                                    con.query(deldebuff);
                                                                }

                                                                message.reply("You used **"+chosenmove+"**.\n"+message.author.username+" "+dialog+"\n\n");
                                                                
                                                                if(multiplier>1){
                                                                    message.reply("The next move to this opponent will have enhanced damage.\n");
                                                                }

                                                                var monsteralive = 1;
                                                                var newmonsterhp = Math.ceil(monsterhp - dmg);
                                                                
                                                                if(newmonsterhp<=0){
                                                                    monsteralive = 0;
                                                                    newmonsterhp = 0;
                                                                }
                                                                
                                                                monsterhpsql = "UPDATE currentfight SET monsterhp = "+newmonsterhp+" WHERE user = '"+message.author.id+"' AND monster = '"+monstername+"'";
                                                                con.query(monsterhpsql);
                                                                message.reply(chosenmove+" has inflicted **"+dmg+"** damage.\n"+monstername+" now has **"+newmonsterhp+"** hp.\n\n");
                                                                
                                                                if (monsteralive==0){
                                                                    if (monstername == "Black Dragon"){
                                                                        var eraseerase = "DELETE FROM erase";
                                                                        con.query(eraseerase);
                                                                    }
                                                                    
                                                                    status = 0;
                                                                    var resetsql = "UPDATE fightstat SET special = 1 WHERE name = '"+message.author.id+"'";
                                                                    con.query(resetsql);
                                                                    var clearcurrent = "DELETE FROM currentfight WHERE user = '"+message.author.id+"'";
                                                                    con.query(clearcurrent);
                                                                    con.query(endsql);
                                                                    var itemmessage;
                                                                    if (dropped ==1){
                                                                        con.query("SELECT * FROM item WHERE number = "+itemnumber,(err13,rows13) =>{
                                                                            if (err13) throw err13;
                                                                            var itemname = rows13[0].name;
                                                                            
                                                                            message.reply("The monster dropped **1 "+itemname+"**");
                                                                            con.query("SELECT * FROM storage WHERE user = '"+message.author.id+"'",(err6,rows6) =>{
                                                                                if (err6) throw err6;
                                                                                if (rows6.length<1){
                                                                                    con.query("SELECT * FROM item WHERE number = "+itemnumber+"",(err14,rows14) =>{
                                                                                        if (err14) throw err14;
                                                                                        var itemsname = rows14[0].name;
                                                                                        var sql = "INSERT INTO storage VALUES ('"+message.author.id+"','"+itemnumber+"','"+itemsname+"',1,1)";
                                                                                        con.query(sql);
                                                                                        con.query("SELECT * FROM inventory WHERE id = '"+message.author.id+"'",(err12,rows12) =>{
                                                                                            if (err12) throw err12;
                                                                                        
                                                                                            var itemsininventory = rows12[0].items;
                                                                                            if (itemsininventory==null){
                                                                                                var newlistofitems = itemnumber;
                                                                                            }
                                                                                            else{
                                                                                                var newlistofitems = itemsininventory+","+itemnumber;
                                                                                            }
                                                                                            var sql2 = "UPDATE inventory set items='"+newlistofitems+"' WHERE id = '"+message.author.id+"'";
                                                                                            console.log("newlistofitems: "+newlistofitems);
                                                                                            con.query(sql2);
                                                                                        })
                                                                                    })
                                                                                }
                                                                                else{
                                                                                    con.query("SELECT * FROM storage WHERE user = '"+message.author.id+"' AND item ="+itemnumber,(err7,rows7) =>{
                                                                                        if (err7) throw err7;
                                                                                        if (rows7.length<1){
                                                                                            
                                                                                            con.query("SELECT * FROM item WHERE number = "+itemnumber+"",(err14,rows14) =>{
                                                                                                con.query("SELECT * FROM storage WHERE user = '"+message.author.id+"'",(err15,rows15) =>{
                                                                                                    var rowsintable = rows15.length;
                                                                                                    if (err14) throw err14;
                                                                                                    var itemsname = rows14[0].name;
                                                                                                    var sql = "INSERT INTO storage VALUES ('"+message.author.id+"','"+itemnumber+"','"+itemsname+"',1,1)";
                                                                                                    if (rowsintable>8){
                                                                                                        sql = "INSERT INTO storage VALUES ('"+message.author.id+"','"+itemnumber+"','"+itemsname+"',1,2)";
                                                                                                    }
                                                                                                    else if (rowsintable>16){
                                                                                                        sql = "INSERT INTO storage VALUES ('"+message.author.id+"','"+itemnumber+"','"+itemsname+"',1,3)";
                                                                                                    }
                                                                                                    else if (rowsintable>24){
                                                                                                        sql = "INSERT INTO storage VALUES ('"+message.author.id+"','"+itemnumber+"','"+itemsname+"',1,4)";
                                                                                                    }
                                                                                                    else if (rowsintable>32){
                                                                                                        sql = "INSERT INTO storage VALUES ('"+message.author.id+"','"+itemnumber+"','"+itemsname+"',1,5)";
                                                                                                    }
                                                                                                    else if (rowsintable>40){
                                                                                                        sql = "INSERT INTO storage VALUES ('"+message.author.id+"','"+itemnumber+"','"+itemsname+"',1,6)";
                                                                                                    }
                                                                                                    else if (rowsintable>48){
                                                                                                        sql = "INSERT INTO storage VALUES ('"+message.author.id+"','"+itemnumber+"','"+itemsname+"',1,7)";
                                                                                                    }
                                                                                                    con.query(sql);
                                                                                                    con.query("SELECT * FROM inventory WHERE id = '"+message.author.id+"'",(err9,rows9) =>{
                                                                                                        if (err9) throw err9;
                                                                                                    
                                                                                                        var itemsininventory = rows9[0].items;
                                                                                                    
                                                                                                        var newlistofitems = itemsininventory+","+itemnumber;
                                                                                                        var sql2 = "UPDATE inventory set items='"+newlistofitems+"' WHERE id = '"+message.author.id+"'";
                                                                                                        console.log("newlistofitems: "+newlistofitems);
                                                                                                        con.query(sql2);
                                                                                                    })
                                                                                                })
                                                                                            })
                                                                                            
                                                                                        }
                                                                                        else{
                                                                                            console.log("item drop working 2");
                                                                                            var newitemquantity = ((rows7[0].quantity) + 1);
                                                                                            var sql = "UPDATE storage SET quantity ="+newitemquantity+" WHERE user = '"+message.author.id+"' AND item ="+itemnumber;
                                                                                            con.query(sql);
                                                                                        }
                                                                                    })
                                                                                }
                                                                            })
                                                                        })
                                                                    }
                                                                    con.query("SELECT * FROM inventory WHERE id = '"+message.author.id+"'",(err8,rows8) =>{
                                                                        if (err8) throw err8;
                                                                        var currcrystals = rows8[0].crystals;
                                                                        var finalsql = "UPDATE inventory SET crystals = "+(currcrystals+crystaldrop)+" WHERE id ='"+message.author.id+"'";
                                                                        message.reply("You have won the fight against "+monstername);
                                                                        message.reply("You got **"+crystaldrop+"** crystals.");
                                                                        con.query(finalsql);
                                                                    })
                                                                }
                                                                else{
                                                                    if (effect=="blind" && monsterccprone==1 && effectnumber==1){
                                                                        
                                                                        message.reply(monstername+" has been blinded and can't sense "+message.author.username);
                                                                        monsterdialog = "did nothing because it was blinded and missed the target.";
                                                                        monsterdmg = 0;
                                                                    }

                                                                    else if (effect=="silence" && monsterccprone==1 && effectnumber==1){
                                                                        
                                                                        message.reply(monstername+" has been blinded and can't sense "+message.author.username);
                                                                        monsterdialog = "was unable to do anything and is silenced.";
                                                                        monsterdmg = 0;
                                                                    }

                                                                    else if (effect=="restrict" && monsterccprone==1 && effectnumber==1){
                                                                        
                                                                        message.reply(monstername+" has been trapped and movement has been restricted by "+message.author.username+". Damage from monster has been halved.");
                                                                        monsterdmg = Math.round(monsterdmg/2);
                                                                    }

                                                                    else if (effect=="shield"){
                                                                        
                                                                        message.reply(message.author.username+" created a shield and can absorb more damage.");
                                                                        if (chosenmove=="ultimate barrier"){
                                                                            hp+=Math.ceil(hp*0.5);
                                                                        }
                                                                        else{
                                                                            hp+= Math.ceil(hp*0.1);
                                                                        }
                                                                    }
                                                                    con.query("SELECT * FROM fightstat WHERE name = '"+message.author.id+"'",(err9,rows9) =>{
                                                                        if (err9) throw err9;
                                                                        var extrahp = rows9[0].extrahp;
                                                                        var curruserhp = rows9[0].hp + extrahp
                                                                        var newuserhp = curruserhp - monsterdmg;
                                                                        console.log(curruserhp);
                                                                        console.log(monsterdmg);
                                                                        console.log(newuserhp);
                                                                        if (newuserhp<=0){
                                                                            newuserhp = 0;
                                                                        }
                                                                        
                                                                        message.reply(monstername+" used **"+monstermove+"**.\n\n"+monstername+" "+monsterdialog+"\n\n"+monstername+" inflicted **"+monsterdmg+"** damage to "+message.author.username+".\n\n"+message.author.username+" now has **"+newuserhp+" HP**");
                                                                        
                                                                        if (newuserhp<=0){
                                                                            status=0;
                                                                            var resetsql = "UPDATE fightstat SET special = 1, hp = 0 WHERE name = '"+message.author.id+"'";
                                                                            con.query(resetsql);
                                                                            newuserhp = 0;
                                                                            var clearcurrent = "DELETE FROM currentfight WHERE user = '"+message.author.id+"'";
                                                                            con.query(clearcurrent);
                                                                            con.query("SELECT * FROM inventory WHERE id = '"+message.author.id+"'",(err10,rows10) =>{
                                                                                if (err10) throw err10;
                                                                                var currcrystals = rows10[0].crystals;
                                                                                
                                                                                con.query(endsql);
                                                                                if ((currcrystals-crystaldrop)<0){
                                                                                    message.reply("You have been critically wounded in your fight with "+monstername+". Just because you have nothing to lose does not mean you have to give your life away.\nThe kingdom does not want to lose an asset like you.");

                                                                                } 
                                                                                else{
                                                                                    message.reply("You have been critically wounded in your fight with "+monstername+" and "+crystaldrop+" magic crystals went missing from your inventory.");
                                                                                    var finalsql = "UPDATE inventory SET crystals = "+(currcrystals-crystaldrop)+" WHERE id ='"+message.author.id+"'";
                                                                                    con.query(finalsql);
                                                                                }
                                                                            })
                                                                        }
                                                                        else{
                                                                            
                                                                            var updatehpsql = "UPDATE fightstat SET hp ="+newuserhp+" WHERE name = '"+message.author.id+"'";
                                                                            con.query(updatehpsql);
                                                                            con.query("SELECT * FROM usermove WHERE user = '"+message.author.id+"'",(err,rows) =>{
                                                                                if (err) throw err;
                                                                                var movesavailable = rows[0].move;
                                                                                var moves = movesavailable.split(",");
                                                                                const embed = new Discord.MessageEmbed()
                                                                                .setTitle(message.author.username+" VS "+monstername)
                                                                                .setDescription("Choose a move from your current moves by typing **"+prefix+" do/chant/choose *movenumber* **.")
                                                                                .setColor("#add8e6")
                                                                                .setThumbnail(message.author.avatarURL);
                                                                                for (i=0;i<moves.length;i++){
                                                                                    embed.addField("Move "+(i+1)+":",moves[i],true);
                                                                                }     
                                                                                message.reply(embed);
                                                                            })
                                                                        }
                                                                    })
                                                                }
                                                            })
                                                        })
                                                    })      
                                                })
                                            })
                                        })
                                    })
                                })
                            }
                            else{
                                message.reply("Move number not understood, please try again.")
                            }
                        }
                        else{
                            message.reply("please choose a move by typing the move number along with the command.");
                        }
                    }

                    else if (stat==2){
                        var turn = 1;
                        con.query("SELECT * FROM duel ",(err0,rows0) =>{
                            if (err0) throw err0;
                            var move1 = rows0[0].movechallenger;
                            var move2 = rows0[0].moveopponent
                            if (move1 == move2){
                                
                                con.query("SELECT * FROM duel WHERE challengerid = '"+message.author.id+"'",(err,rows) =>{
                                    
                                    if (rows.length<1){
                                        message.reply("Wait for challenger to use their move first.");
                                    }
                                    else {
                                        var myhp = rows[0].challengerhp;
                                        var moveno = rows[0].movechallenger;
                                        var movechallenger = rows[0].movechallenger;
                                        var moveopponent = rows[0].moveopponent;
                                        moveno+=1;
                                        if (args[2]==null){
                                            message.reply("Choose a move number.");
                                        }
                                        else{
                                            var multiplier1 = 1;
                                            
                                            if (args[2]>=1 && args[2]<=10){
                                                con.query("SELECT * FROM fightstat WHERE name = '"+message.author.id+"'",(err,rows) =>{
                                                    if (err) throw err;
                                                    var extraatk = rows[0].extraatk;
                                                    var multi = rows[0].special;
                                                    con.query("SELECT * FROM usermove WHERE user = '"+message.author.id+"'",(err1,rows1) =>{
                                                        if (err1) throw err1;
                                                        var number = args[2]-1;
                                                        var usermoves = rows1[0].move.split(",");
                                                        var chosenmove = usermoves[number];
                                                        con.query("SELECT * FROM moveinfo WHERE move = '"+chosenmove+"'",(err2,rows2) =>{
                                                            if (err2) throw err2;
                                                            var min = rows2[0].mindmg;
                                                            var max = rows2[0].maxdmg;
                                                            var effect = rows2[0].effect;
                                                            var maxeffect = rows2[0].chanceeffect;
                                                            var mineffect = 1;
                                                            var effectnumber = Math.floor(Math.random() * maxeffect + mineffect);
                                                            multiplier1 = rows2[0].multiplier;
                                                            
                                                            

                                                            if (chosenmove == "blessings of gaia"){
                                                                var minr = 1
                                                                var maxr = 2
                                                                var ran = Math.floor(Math.random() * maxr + minr);
                                                                if (ran == 2){
                                                                    multiplier1 = 0;
                                                                    var multipliersql = "UPDATE fightstat SET special ="+multiplier1+" WHERE name = '"+message.author.id+"'";
                                                                    con.query(multipliersql);
                                                                }
                                                                else{
                                                                    multiplier1 = 3;
                                                                    var multipliersql = "UPDATE fightstat SET special ="+multiplier1+" WHERE name = '"+message.author.id+"'";
                                                                con.query(multipliersql);
                                                                }
                                                            }

                                                            if (effect == "link" && chosenmove == "to the shadows"){
                                                                multiplier1 = 3;
                                                            }

                                                            var multipliersql = "UPDATE fightstat SET special ="+multiplier1+" WHERE name = '"+message.author.id+"'";
                                                            con.query(multipliersql);

                                                            if (max==0 && min == 0){
                                                                var dmg=0;
                                                            }
                                                            else{
                                                                var dmg = ((Math.floor(Math.random() * max + min))* multi) + extraatk;
                                                                dmg = Math.ceil(dmg/2);
                                                            }
                                                            
                                                            var dialog = rows2[0].dialog;
                                                            
                                                            con.query("SELECT * FROM duel WHERE challengerid = '"+message.author.id+"'",(err3,rows3) =>{
                                                                if (err3) throw err3;
                                                                var opponentid = rows3[0].opponentid;
                                                                var opponentshp = rows3[0].opponenthp;
                                                                var checkeffect = rows3[0].effect;
                                                                if (checkeffect=="blind" || checkeffect=="silence"){
                                                                    if (effectnumber==1){
                                                                        dmg = 0;
                                                                        var neweffectduelsql= "UPDATE duel SET effect = 'none' WHERE challengerid = '"+message.author.id+"'";
                                                                        con.query(neweffectduelsql);
                                                                    }
                                                                }

                                                                else if (checkeffect=="restrict"){
                                                                    if (effectnumber==1){
                                                                        dmg = dmg/2;
                                                                        var neweffectduelsql= "UPDATE duel SET effect = 'none' WHERE challengerid = '"+message.author.id+"'";
                                                                        con.query(neweffectduelsql);
                                                                    }
                                                                }

                                                                if (effect!="none"){
                                                                    effectduelsql= "UPDATE duel SET effect = '"+effect+"' WHERE challengerid = '"+message.author.id+"'";
                                                                    con.query(effectduelsql);
                                                                }

                                                                if (effect=="shield"){
                                                                    myhp = myhp + Math.ceil(0.1*(myhp));
                                                                    message.reply("The challenger has increased percent of their HP.");
                                                                    if (chosenmove=="ultimate barrier"){
                                                                        myhp = myhp+ Math.ceil(0.5*(myhp));
                                                                    }
                                                                    var deletesql= "DELETE FROM duel";
                                                                    con.query(deletesql);
                                                                    var insertsql = "INSERT INTO duel VALUES ('"+message.author.id+"','"+opponentid+"',"+myhp+","+opponentshp+","+movechallenger+","+moveopponent+",'"+checkeffect+"')";
                                                                    con.query(insertsql);
                                                                }

                                                                var newopponenthp = opponentshp - dmg;
                                                                
                                                                message.channel.send("The challenger has inflicted **"+dmg+"** to the opponent.");
                                                                
                                                                if (newopponenthp<=0){
                                                                    newopponenthp==0;
                                                                    message.channel.send("The opponent now has **"+newopponenthp+"** HP.");
                                                                    message.reply("You have won this fight.\nCongratulations.");
                                                                    var multiplierendsql = "UPDATE fightstat SET special = 1, status = 0 WHERE name = '"+message.author.id+"' OR name = '"+opponentid+"'";
                                                                    con.query(multiplierendsql);
                                                                    var endduelsql = "DELETE FROM duel WHERE opponentid = '"+message.author.id+"' OR challengerid = '"+message.author.id+"'";
                                                                    con.query(endduelsql);
                                                                }

                                                                else{
                                                                    var movemadesql = "UPDATE duel SET movechallenger ="+moveno+" WHERE challengerid = '"+message.author.id+"'";
                                                                    con.query(movemadesql);
                                                                    var newopponenthpsql = "UPDATE duel SET opponenthp ="+newopponenthp+" WHERE challengerid = '"+message.author.id+"'";
                                                                    con.query(newopponenthpsql);
                                                                    message.channel.send("The opponent now has **"+newopponenthp+"** HP.");
                                                                    message.channel.send(message.author.username+" used **"+chosenmove+"**.\n"+message.author.username+" "+dialog);
                                                                    message.channel.send("It is now the opponent's turn.");
                                                                    con.query("SELECT * FROM usermove WHERE user = '"+opponentid+"'",(err,rows) =>{
                                                                        if (err) throw err;
                                                                        var movesavailable = rows[0].move;
                                                                        var moves = movesavailable.split(",");
                                                                        const embed = new Discord.MessageEmbed()
                                                                        .setDescription("Choose a move from your current moves by typing **"+prefix+" do/chant/choose *movenumber* **.")
                                                                        .setColor("#add8e6")
                                                                        .setThumbnail(message.author.avatarURL);
                                                                        con.query("SELECT * FROM inventory WHERE id = '"+opponentid+"'",(errlast,rowslast) =>{
                                                                            if (errlast) throw errlast;
                                                                            var oppname = rowslast[0].name;
                                                                            embed.setTitle(message.author.username+" VS "+oppname);
                                                                        })
                                                                        
                                                                        for (i=0;i<moves.length;i++){
                                                                            embed.addField("Move "+(i+1)+":",moves[i],true);
                                                                        }     
                                                                        message.channel.send(embed);
                                                                    })
                                                                }
                                                            })
                                                        })
                                                    })
                                                })
                                            }
                                        }
                                    }
                                })
                            }
                            else{
                                con.query("SELECT * FROM duel WHERE opponentid = '"+message.author.id+"'",(err,rows) =>{
                                    if (rows.length<1){
                                        message.reply("No duel/fight currently.");
                                    }
                                    else {
                                        var myhp = rows[0].opponenthp;
                                        var moveno = rows[0].moveopponent;
                                        var movechallenger = rows[0].movechallenger;
                                        var moveopponent = rows[0].moveopponent;
                                        moveno+=1;
                                        if (args[2]==null){
                                            message.reply("Choose a move number.");
                                        }
                                        else{
                                            var multiplier1 = 1;
                                            
                                            if (args[2]>=1 && args[2]<=10){
                                                con.query("SELECT * FROM fightstat WHERE name = '"+message.author.id+"'",(err,rows) =>{
                                                    if (err) throw err;
                                                    var extraatk = rows[0].extraatk;
                                                    var multi = rows[0].special;
                                                    con.query("SELECT * FROM usermove WHERE user = '"+message.author.id+"'",(err1,rows1) =>{
                                                        if (err1) throw err1;
                                                        var number = args[2]-1;
                                                        var usermoves = rows1[0].move.split(",");
                                                        var chosenmove = usermoves[number];
                                                        con.query("SELECT * FROM moveinfo WHERE move = '"+chosenmove+"'",(err2,rows2) =>{
                                                            if (err2) throw err2;
                                                            var min = rows2[0].mindmg;
                                                            var max = rows2[0].maxdmg;
                                                            var effect = rows2[0].effect;
                                                            multiplier1 = rows2[0].multiplier;
                                                            var movelevel = rows2[0].level;
                                                            if (chosenmove == "blessings of gaia"){
                                                                var min = 1
                                                                var max = 2
                                                                var ran = Math.floor(Math.random() * max + min);
                                                                if (ran == 2){
                                                                    multiplier1 = 0;
                                                                }
                                                                else{
                                                                    multiplier1 = 3;
                                                                }
                                                            }
                                                            var maxeffect = rows2[0].chanceeffect;
                                                            var mineffect = 1;
                                                            var effectnumber = Math.floor(Math.random() * maxeffect + mineffect);

                                                            if (effect == "link" && chosenmove == "to the shadows"){
                                                                multiplier1 = 3;
                                                            }

                                                            var multipliersql = "UPDATE fightstat SET special ="+multi+" WHERE name = '"+message.author.id+"'";
                                                            con.query(multipliersql);

                                                            if (max==0 && min == 0){
                                                                var dmg=0;
                                                            }
                                                            else{
                                                                var dmg = ((Math.floor(Math.random() * max + min))* multi) + extraatk;
                                                                dmg = Math.ceil(dmg/2);
                                                            }
                                                        
                                                            var dialog = rows2[0].dialog;
                                                            
                                                            con.query("SELECT * FROM duel WHERE opponentid = '"+message.author.id+"'",(err3,rows3) =>{
                                                                if (err3) throw err3;
                                                                var challengerid = rows3[0].challengerid;
                                                                var challengershp = rows3[0].challengerhp;
                                                                var checkeffect = rows3[0].effect;
                                                                
                                                                if (checkeffect=="blind" || checkeffect=="silence" && effectnumber==1){
                                                                    dmg = 0;
                                                                    checkeffect = 'none';
                                                                    var neweffectduelsql= "UPDATE duel SET effect = 'none' WHERE opponentid = '"+message.author.id+"'";
                                                                    con.query(neweffectduelsql);
                                                                }

                                                                else if (checkeffect=="restrict" && effectnumber==1){
                                                                    dmg = Math.floor(dmg/2);
                                                                    checkeffect = 'none';
                                                                    var neweffectduelsql= "UPDATE duel SET effect = 'none' WHERE opponentid = '"+message.author.id+"'";
                                                                    con.query(neweffectduelsql);
                                                                }

                                                                if (effect!="none"){
                                                                    effectduelsql= "UPDATE duel SET effect = '"+effect+"' WHERE opponentid = '"+message.author.id+"'";
                                                                    con.query(effectduelsql);
                                                                }

                                                                if (effect=="shield" && effectnumber==1){
                                                                    myhp = myhp + Math.ceil(0.1*(myhp));
                                                                    message.reply("The opponent has gained a percent of own HP as shield.");
                                                                    if (chosenmove=="ultimate barrier"){
                                                                        myhp = Math.ceil(0.5*(myhp));
                                                                    }
                                                                    console.log("newhp:"+myhp);
                                                                    var deletesql= "DELETE FROM duel";
                                                                    con.query(deletesql);
                                                                    var insertsql = "INSERT INTO duel VALUES ('"+challengerid+"','"+message.author.id+"',"+challengershp+","+myhp+","+movechallenger+","+moveopponent+",'"+checkeffect+"')";
                                                                    con.query(insertsql);
                                                                }

                                                                var newchallengerhp = challengershp - dmg;
                                                                
                                                                message.channel.send("The opponent has inflicted **"+dmg+"** damage to the challenger.");
                                                                
                                                                if (newchallengerhp<=0){
                                                                    newchallengerhp=0;
                                                                    message.channel.send("The challenger now has **"+newchallengerhp+"** HP.");
                                                                    message.reply("You have won this fight.\nCongratulations.");
                                                                    var multiplierendsql = "UPDATE fightstat SET special = 1, status = 0 WHERE name = '"+message.author.id+"' OR name = '"+challengerid+"'";
                                                                    con.query(multiplierendsql);
                                                                    var endduelsql = "DELETE FROM duel WHERE opponentid = '"+message.author.id+"' OR challengerid = '"+message.author.id+"'";
                                                                    con.query(endduelsql);
                                                                }

                                                                else{
                                                                    var movemadesql = "UPDATE duel SET moveopponent ="+moveno+" WHERE opponentid = '"+message.author.id+"'";
                                                                    con.query(movemadesql);
                                                                    var newchallengerhpsql = "UPDATE duel SET challengerhp ="+newchallengerhp+" WHERE opponentid = '"+message.author.id+"'";
                                                                    con.query(newchallengerhpsql);
                                                                    message.channel.send("The challenger now has **"+newchallengerhp+"** HP.");
                                                                    message.channel.send(message.author.username+" used **"+chosenmove+"**.\n"+message.author.username+" "+dialog);
                                                                    message.channel.send("It is now the challenger's turn.");
                                                                    con.query("SELECT * FROM usermove WHERE user = '"+challengerid+"'",(err,rows) =>{
                                                                        if (err) throw err;
                                                                        var movesavailable = rows[0].move;
                                                                        var moves = movesavailable.split(",");
                                                                        const embed = new Discord.MessageEmbed()
                                                                        .setDescription("Choose a move from your current moves by typing **"+prefix+" do/chant/choose *movenumber* **.")
                                                                        .setColor("#add8e6")
                                                                        .setThumbnail(message.author.avatarURL);
                                                                        con.query("SELECT * FROM inventory WHERE id = '"+challengerid+"'",(errlast,rowslast) =>{
                                                                            if (errlast) throw errlast;
                                                                            var challname = rowslast[0].name;
                                                                            embed.setTitle(message.author.username+" VS "+challname);
                                                                        })
                                                                        
                                                                        for (i=0;i<moves.length;i++){
                                                                            embed.addField("Move "+(i+1)+":",moves[i],true);
                                                                        }     
                                                                        message.channel.send(embed);
                                                                    })
                                                                }
                                                            })
                                                        })
                                                    })
                                                })
                                            }
                                        }
                                    }
                                })
                            }
                        })
                    }

                    else{
                        message.reply("You are currently not fighting anyone/anything.");
                    }
                })
                break;
            case "inventory":
            case "inv":
            case "bag":
                const embed1 = new Discord.MessageEmbed()
                .setTitle(message.author.username+"'s inventory")
                .setDescription("Kill Monster to get EXP,Items and Crystals!")
                .setColor("#add8ec")
                .setThumbnail(message.avatarURL);
                enteredpage = args[2];
                if (args[2]==null || args[2].toLowerCase() == "p1"){
                    enteredpage = 1;
                }
                else if (args[2].toLowerCase() == "p2"){
                    enteredpage = 2;
                }
                else if (args[2].toLowerCase() == "p3"){
                    enteredpage = 3;
                }
                else{
                    enteredpage = 0;
                }
                con.query("SELECT * FROM inventory WHERE id = '"+message.author.id+"'",(err1,rows1) =>{
                    if (err1) throw err1;
                    var crystals = rows1[0].crystals;
                    embed1.setDescription("Showing items in inventory, page "+enteredpage+".\nYou have **"+crystals+ " magic crystals**.");
                })
               
                if (enteredpage!=0){
                    con.query("SELECT * FROM storage WHERE user = '"+message.author.id+"' AND page = "+enteredpage,(err,rows) =>{
                        if (rows.length<1){
                            if (enteredpage==1){
                                con.query("SELECT * FROM inventory WHERE id = '"+message.author.id+"'",(err1,rows1) =>{
                                    if (err1) throw err1;
                                    var crystals = rows1[0].crystals;
                                    embed1.setDescription("You have **"+crystals+ " magic crystals**.");
                                })
                                message.reply(embed1);
                                message.reply("You do not own any items.");
                            }
                            else{
                                message.reply("You do not have any items in this page.");
                            }
                        }
                        else{
                            for (i=0;i<rows.length;i++){
                                embed1.addField("Name: ",rows[i].itemname,true);
                                embed1.addField("Quantity: ",rows[i].quantity,true);
                                embed1.addField("Item Number: ","**"+rows[i].item+"**",true);
                            }
                            con.query("SELECT * FROM storage WHERE user = '"+message.author.id+"'",(err1,rows1) =>{
                                if (err1) throw err1;
                                var pagenumbers =  Math.ceil((rows1.length)/7);
                                embed1.setFooter("You have "+pagenumbers+" page(s) in inventory. To navigate to other pages, please do "+prefix+" inventory p1/p2/p3...");
                                message.reply(embed1);
                            })                           
                        }
                    })
                }
                else{
                    message.reply("Page number not understood. Please enter valid page number.\nExample: **"+prefix+" inventory p2**");
                }
                break;

            case "give":
            case "share":
            case "donate":
                var wrong = 0;
                var itemtogive = parseInt(args[2]);
                var quantitytogive = parseInt(args[3]);
                var personreceiving = args[4];
               
                if (args[2]==null || typeof itemtogive != "number" || isNaN(itemtogive)){
                    message.reply("Please enter a valid item number.");
                    wrong = 1;
                }
                if (args[3] == null || typeof quantitytogive != "number" || isNaN(quantitytogive)){
                    message.reply("Please enter a valid quantity.");
                    wrong = 1;
                }
                if (args[4] == null){
                    message.reply("Please enter the person you want to share your item to, after specifying the item number and quantity.");
                    wrong = 1;
                }

                if (wrong==1){
                    message.reply("Please do: **"+prefix+" share/donate/give *itemnumber quantity @person* **");
                    wrong = 0;
                }
                else{
                    personreceiving = personreceiving.replace("<","");
                    personreceiving = personreceiving.replace("!","");
                    personreceiving = personreceiving.replace("@","");
                    personreceiving = personreceiving.replace(">","");
                    con.query("SELECT * FROM item WHERE number = "+itemtogive+"",(err0,rows0) =>{
                        if (rows0.length<1){
                            message.reply("This item number is non existant. Please enter a valid item number.");
                        }
                        else{
                            var itemname = rows0[0].name;
                        }
                        con.query("SELECT * FROM inventory WHERE id = '"+personreceiving+"'",(err,rows) =>{
                            if (err) throw err;
                            
                            if (rows.length<1){
                                message.reply("Could not find this user.");
                            }
                            else{
                                var nameofpersonreceiving = rows[0].name;
                                con.query("SELECT * FROM storage WHERE user = '"+message.author.id+"'",(err1,rows1) =>{
                                    if (err1) throw err1;
                                    if (rows1.length<1){
                                        message.reply("You do not own any items to share.");
                                    }
                                    else{
                                        con.query("SELECT * FROM storage WHERE user = '"+message.author.id+"' AND item = "+itemtogive,(err2,rows2) =>{
                                            if (err2) throw err2;
                                            if (rows2.length<1){
                                                message.reply("You do not have the item with the specified item number.");
                                            }
                                            else{
                                                quantityowned = rows2[0].quantity;
                                                if (quantityowned<quantitytogive){
                                                    message.reply("You only have **"+quantityowned+"** "+itemname+"(s). Please specify a valid quantity.");
                                                }
                                                else{ 
                                                    if (quantityowned==quantitytogive){
                                                        var eraseitemsql = "DELETE FROM storage WHERE  user = '"+message.author.id+"' AND item = "+itemtogive;
                                                        con.query(eraseitemsql);
                                                    }
                                                    else{
                                                        var updatequantitysql = "UPDATE storage SET quantity = "+(quantityowned-quantitytogive)+" WHERE user = '"+message.author.id+"' AND item = "+itemtogive;
                                                        con.query(updatequantitysql);
                                                    }
                                                    con.query("SELECT * FROM storage WHERE user = '"+personreceiving+"' AND item = "+itemtogive,(err3,rows3) =>{
                                                        if (err3) throw err3;
                                                        if (rows3.length<1){
                                                            con.query("SELECT * FROM storage WHERE user = '"+personreceiving+"'",(err4,rows4) =>{
                                                                if (err4) throw err4;
                                                                if (rows4.length<1){
                                                                    var addnewrowsql = "INSERT INTO storage VALUES ('"+personreceiving+"',"+itemtogive+",'"+itemname+"',"+quantitytogive+",1)";
                                                                    con.query(addnewrowsql);
                                                                }
                                                                else{
                                                                    con.query("SELECT * FROM storage WHERE item = '"+itemtogive+"'",(err6,rows6) =>{
                                                                        if (err6) throw err6;
                                                                        if (rows6.length<1){
                                                                            con.query("SELECT * FROM storage WHERE user = '"+personreceiving+"' order by page desc limit 1",(err7,rows7) =>{
                                                                                if (err7) throw err7;
                                                                                var pagenumber = rows7[0].page;
                                                                                con.query("SELECT * FROM storage WHERE user = '"+personreceiving+"' AND page="+pagenumber,(err8,rows8) =>{
                                                                                    if (err8) throw err8;
                                                                                    var numberofitemsinpage = rows8.length;
                                                                                    if (numberofitemsinpage%7==0){
                                                                                        pagenumber+=1;
                                                                                    }
                                                                                    var insertreceiversql = "INSERT INTO storage VALUES ('"+personreceiving+"',"+itemtogive+",'"+itemname+"',1,"+pagenumber+")";
                                                                                    con.query(insertreceiversql);
                                                                                })
                                                                            })
                                                                        }
                                                                    })
                                                                }
                                                            })
                                                            
                                                        }
                                                        else{
                                                            var quantityownedbyreceiving = rows3[0].quantity;
                                                            con.query("SELECT * FROM storage WHERE user = '"+personreceiving+"' order by page desc limit 1",(err5,rows5) =>{
                                                                if (err5) throw err5;
                                                                var pagenumber = rows5[0].page;
                                                                con.query("SELECT * FROM storage WHERE user = '"+personreceiving+"' AND page="+pagenumber,(err6,rows6) =>{
                                                                    if (err6) throw err6;
                                                                    var numberofitemsinpage = rows6.length;
                                                                    if (numberofitemsinpage==8){
                                                                        pagenumber+=1;
                                                                    }
                                                                    var updatereceiversql = "UPDATE storage SET quantity = "+(quantityownedbyreceiving+quantitytogive)+" WHERE item = "+itemtogive+" AND user = '"+personreceiving+"'";
                                                                    con.query(updatereceiversql);
                                                                })
                                                            })
                                                            
                                                        }
                                                        message.channel.send(message.author.username+" has given "+quantitytogive+" "+itemname+"(s) to "+nameofpersonreceiving);
                                                    })
                                                    
                                                }
                                            }
                                            
                                        })
                                    }
                                    
                                })
                            }
                        })
                    })
                }
                break;
            case "mymoves":
            case "mymove":
                con.query("SELECT * FROM usermove WHERE user = '"+message.author.id+"'",(err1,rows1) =>{
                    if (err1) throw err1;
                    var currentmoves = rows1[0].move.split(",");
                    const embed = new Discord.MessageEmbed()
                    .setTitle("Your Moves")
                    .setDescription("This is the moves you know right now, do **"+prefix+" moves** to see moves that can be learnt.")  
                    .setColor("#add8e6")
                    .setThumbnail(message.author.avatarURL);
                    for (i=0;i<currentmoves.length;i++){
                        embed.addField("Move "+(i+1)+":",currentmoves[i],true);
                    }
                    message.reply(embed);
                })
                break;

            case "stat":
            case "fighstat":
            case "strength":
            case "extraatk":
            case "extrahp":
            case "atk":
            case "hp":
            case "profile":
                con.query("SELECT * FROM fightstat WHERE name = '"+message.author.id+"'",(err1,rows1) =>{
                    if (err1) throw err1;
                    if (rows1.length<1){
                        message.reply("This user does not exist.. try again.");
                    }
                    else{
                        var hp = rows1[0].hp;
                        var extrahp = rows1[0].extrahp;
                        var extraatk = rows1[0].extraatk;
                        const embed = new Discord.MessageEmbed()
                        .setTitle("Your Stats:")
                        .setDescription("This is your current stats.")  
                        .setColor("#add8e6")
                        .setThumbnail(message.author.avatarURL)
                        .addField("Health:",hp,true)
                        .addField("Extra Health:",extrahp,true)
                        .addField("Extra Attack:",extraatk,true)
                        .addField("Total Health:",hp+extrahp);
                        message.reply(embed);
                    }
                })
                break;
            case "duel":
            case "challenge":
            case "1v1":
                con.query("SELECT * FROM fightstat WHERE name = '"+message.author.id+"'",(err0,rows0) =>{
                    var challstatus = rows0[0].status;
                    if (challstatus==0){
                        if (args[2]==null){
                            message.reply("You have to specify your opponent.\nExample: **"+prefix+" duel @personname**");
                        }
                        
                        else{
                            con.query("SELECT * FROM user WHERE name = '"+message.author.id+"'",(err2,rows2) =>{
                                if (err2) throw err2;
                                if (rows2[0].role == null){
                                    message.reply("Please choose a role first. Do **"+prefix+" roles** to select a role.");
                                }
                                else{
                                    var opponent = args[2];
                                    opponent = opponent.replace("<","");
                                    opponent = opponent.replace("!","");
                                    opponent = opponent.replace("@","");
                                    opponent = opponent.replace(">","");
                                    if (opponent==message.author.id){
                                        message.reply("Self harm does no good to anyone.");
                                    }
                                    else{
                                        con.query("SELECT * FROM fightstat WHERE name = '"+opponent+"'",(err1,rows1) =>{
                                            if (err1) throw err1;
                                            if (rows1.length<1){
                                                message.reply("The person you have challenged does not exist. Try again, but with a real opponent.");
                                            }
                                            else{
                                                if (rows1[0].status!=0){
                                                    message.reply("They are currently in a fight.\nWait for them to finish the fight before challenging them again.");
                                                }
                                                else{
                                                    con.query("SELECT * FROM fightstat WHERE status = 4 OR status = 3 OR status = 2",(err2,rows2) =>{
                                                        if (err2) throw err2;
                                                        if (rows2.length>=1){
                                                            message.reply("A duel is currently in progress.\nThe fighting arena only accepts one duel at a time.")
                                                        }
                                                        else{
                                                            updateopponentsql = "UPDATE fightstat SET status = 3 WHERE name ='"+opponent+"'";
                                                            updatechallengersql = "UPDATE fightstat SET status = 4 WHERE name ='"+message.author.id+"'";
                                                            con.query(updateopponentsql);
                                                            con.query(updatechallengersql);
                                                            con.query("SELECT * FROM inventory WHERE id = '"+opponent+"'",(err3,rows3) =>{
                                                                var nameopponent = rows3[0].name;
                                                                message.channel.send(nameopponent+", "+message.author.username+" has challenged you.\nType **"+prefix+" accept** to accept the challenge or **"+prefix+" deny** to deny.");
                                                            })
                                                        }
                                                    })
                                                }
                                            }
                                        })
                                    }
                                }
                            })
                        }
                    }
                    else{
                        message.reply("You are currently engaged in a fight.");
                    }
                })
                break;
            
            case "accept":
                con.query("SELECT * FROM user WHERE name = '"+message.author.id+"'",(err2,rows2) =>{
                    if (err2) throw err2;
                    if (rows2[0].role == null){
                        message.reply("Please choose a role first. Do **"+prefix+" roles** to select a role.");
                    }
                    else{
                        con.query("SELECT * FROM fightstat WHERE name = '"+message.author.id+"'",(err1,rows1) =>{
                            if (err1) throw err1;
                            var status = rows1[0].status;
                            var opponenthp = rows1[0].hp;
                            var extrahpopponent = rows1[0].extrahp;
                            opponenthp+=extrahpopponent
                            if (status!=3){
                                message.reply("No one has challenged you recently or you are currently in a fight.");
                            }

                            else{
                                con.query("SELECT * FROM fightstat WHERE status = 4",(err2,rows2) =>{
                                    var challengerhp = rows2[0].hp;
                                    var extrahpchallenger = rows2[0].extrahp;
                                    challengerhp+= extrahpchallenger;
                                    var challenger = rows2[0].name;
                                    var newduelsql = "INSERT INTO duel (challengerid,opponentid,challengerhp,opponenthp,movechallenger,moveopponent) VALUES ('"+challenger+"','"+message.author.id+"',"+challengerhp+","+opponenthp+",1,1)";
                                    con.query(newduelsql);

                                    var updatestatustduel1 = "UPDATE fightstat set status = 2 WHERE name = '"+message.author.id+"' OR status = 4";
                                    con.query(updatestatustduel1);

                                    con.query("SELECT * FROM usermove WHERE user = '"+challenger+"'",(err,rows) =>{
                                        if (err) throw err;
                                        var movesavailable = rows[0].move;
                                        var moves = movesavailable.split(",");
                                        con.query("SELECT * FROM inventory WHERE id = '"+challenger+"'",(err3,rows3) =>{
                                            var challengername = rows3[0].name;
                                            const embed = new Discord.MessageEmbed()
                                            .setTitle(challengername+" VS "+message.author.username)
                                            .setDescription(challengername+", choose a move from your current moves by typing **"+prefix+" do/chant/choose *movenumber* **.")
                                            .setColor("#add8e6")
                                            .setThumbnail(message.author.avatarURL);
                                            for (i=0;i<moves.length;i++){
                                                embed.addField("Move "+(i+1)+":",moves[i],true);
                                            }     
                                            message.channel.send(embed);
                                            //setTimeout(fightExpire, 120000, message.author.name);
                                        })
                                    })
                                })
                            }
                        })
                    }
                })
                break;

            case "deny":
                con.query("SELECT * FROM fightstat WHERE name = '"+message.author.id+"'",(err1,rows1) =>{
                    var status = rows1[0].status;
                    if (status==3 ||status==4){
                        var backtonormalstatussql = "UPDATE fightstat SET status = 0 WHERE name = '"+message.author.id+"' OR status = 4 OR status = 3";
                        con.query(backtonormalstatussql);
                        message.channel.send("The duel request has been denied.");
                        
                    }
                    else{
                        message.reply("No one has challenged you recently or you are currently in a fight.");
                    }
                })
                break;
            
            case "run":
            case "flee":
                con.query("SELECT * FROM fightstat WHERE name = '"+message.author.id+"'",(err1,rows1) =>{
                    var status = rows1[0].status;
                    if (status==1){
                        message.channel.send(message.author.username+" has fled from the monster.");
                        var updatefightstat = "UPDATE fightstat SET status = 0 WHERE name = '"+message.author.id+"'";
                        var removefromcurrentfight = "DELETE FROM currentfight WHERE user = '"+message.author.id+"'";
                        con.query(updatefightstat);
                        con.query(removefromcurrentfight);
                    }
                    else if (status==2){
                        message.channel.send(message.author.username+" tries to run away from the duel midway.\nShame.");
                    }
                    else{
                        message.reply("What are you trying to run away from?");
                    }
                })
                break;
            case "info":
                if (args[2]=="item"){
                    if (args[3]==null){
                        message.reply("Enter item number or item name to get information of.");
                    }
                    else{
                        var intofarg = parseInt(args[3]); 
                        if (!isNaN(intofarg)){
                            con.query("SELECT * FROM item WHERE number = "+args[3]+"",(err1,rows1) =>{
                                if (err1) throw err1;
                                if (rows1.length<1){
                                    message.reply("This item number does not exist. Try again.");
                                }
                                else{
                                    var nameofitem = rows1[0].name;
                                    var description = rows1[0].description;
                                    var sellprice = rows1[0].crystalworth;
                                    var typeofitem = rows1[0].type;
                                    var roleofitem = rows1[0].role;
                                    var extraatkofitem = rows1[0].extraatk;
                                    var extrahpofitem = rows1[0].extrahp; 
                                    var image = rows1[0].url;
                                    const embed = new Discord.MessageEmbed()
                                    .setTitle("Item Details:")
                                    .setDescription("This is the information known about the item.")  
                                    .setColor("#add8e6")
                                    .setThumbnail(image)
                                    .addField("Name:",nameofitem)
                                    .addField("Roles Applicable:",roleofitem,true)
                                    .addField("Type:",typeofitem,true)
                                    .addField("Description",description)
                                    .addField("Extra Attack:",extraatkofitem,true)
                                    .addField("Extra HP:",extrahpofitem,true)
                                    .addField("Worth (crystals):",sellprice);
                                    message.reply(embed);
                                }
                            })
                       }
                       else{
                           console.log(typeof args[3]);
                       }
                    }
                }

                else if (args[2]=="move"){
                    var found = 0;
                    if (args[3]==null){
                        message.reply("Specify the move name to get details of.");
                    }
                    else{
                        var moveforinfo = args[3].toLowerCase();
                        if (moveforinfo=="poke" || moveforinfo=="stab" || moveforinfo=="swing"){
                            con.query("SELECT * FROM moveinfo WHERE move = '"+moveforinfo+"'",(err4,rows4) =>{
                                var movedescription = rows4[0].description;
                                var mindmg = rows4[0].mindmg;
                                var maxdmg = rows4[0].maxdmg;
                                var leveltolearn = rows4[0].level;
                                var multiplier = rows4[0].multiplier;
                                var effect = rows4[0].effect;
                               
                                const embed = new Discord.MessageEmbed()
                                .setTitle("Move Detail:")
                                .setDescription("This is the information known about the move.")  
                                .setColor("#add8e6")
                                //.setThumbnail(image)
                                .addField("Name:",moveforinfo)
                                .addField("Description:",movedescription)
                                .addField("Minimum Damage:",mindmg,true)
                                .addField("Maximum Damage:",maxdmg,true)
                                .addField("Multiplier:","x"+multiplier,true)
                                .addField("Special Effect:",effect)
                                message.channel.send(embed);
                                
                            })
                        }
                        else{
                            if (args[4]!=null){
                                moveforinfo = args[3].toLowerCase() +" "+ args[4].toLowerCase();
                            }
                            
                            if (args[5]!=null){
                                moveforinfo = args[3].toLowerCase() +" "+ args[4].toLowerCase()+" "+ args[5].toLowerCase();
                            }
                            
                            con.query("SELECT * FROM user WHERE name = '"+message.author.id+"'",(err3,rows3) =>{
                                if (err3) throw err3;
                                var usersrole = rows3[0].role;
                                var userslevel = rows3[0].level;
                                con.query("SELECT * FROM roles WHERE role = '"+usersrole+"'",(err2,rows2) =>{
                                    var movesinrole = rows2[0].move;
                                    movesinrole =  movesinrole.split(",");
                                    var movearray = [];
                                    for (i=0; i<movesinrole.length;i++){
                                        movearray[i] = movesinrole[i];
                                        var move1 = movearray[i].replace(/^\s+/,"");;
                                        if (move1.toLowerCase() == moveforinfo){
                                            found=1;
                                            con.query("SELECT * FROM moveinfo WHERE move = '"+moveforinfo+"'",(err4,rows4) =>{
                                                var movedescription = rows4[0].description;
                                                var mindmg = rows4[0].mindmg;
                                                var maxdmg = rows4[0].maxdmg;
                                                var leveltolearn = rows4[0].level;
                                                var multiplier = rows4[0].multiplier;
                                                var effect = rows4[0].effect;
                                                if (userslevel>=leveltolearn){
                                                    const embed = new Discord.MessageEmbed()
                                                    .setTitle("Move Detail:")
                                                    .setDescription("This is the information known about the move.")  
                                                    .setColor("#add8e6")
                                                    //.setThumbnail(image)
                                                    .addField("Name:",moveforinfo)
                                                    .addField("Role:",usersrole,true)
                                                    .addField("Description:",movedescription)
                                                    .addField("Minimum Damage:",mindmg,true)
                                                    .addField("Maximum Damage:",maxdmg,true)
                                                    .addField("Multiplier:","x"+multiplier,true)
                                                    .addField("Special Effect:",effect)
                                                    message.channel.send(embed);
                                                }
                                                else{
                                                    message.reply("Your level is lower than the required level to learn this skill.\nNo information can be told to those who are not experienced enough.");
                                                }
                                            })
                                        }
                                    }
                                    if (found==0){
                                        message.reply("Move not found in your role.");
                                    }
                                })
                            })
                        }
                    }
                }

                else{
                    message.reply("Type **"+prefix+"   move/item    movename/itemname/itemnumber**");
                }
                break;
            case "petshop":
                if (day == 25 && message.channel.name == "davys-petshop"){
                    con.query("SELECT * FROM petshop",(err,rows) =>{
                        var len = rows.length;

                        const embed = new Discord.MessageEmbed()
                        .setTitle("Davy's Pet Shop:")
                        .setDescription("Hey there! I'm Davy. I've been outside the kingdom and have collected some cool pets for you guys!\nThese aren't cheap tho..")  
                        .setColor("#add8e6")
                        .setFooter("Type "+prefix+" petbuy petname to buy a pet.")
                        //.setThumbnail(image)
                        for (i=0;i<len;i++){
                            if (rows[i].month == month || rows[i].month == 0){
                                embed.addField('\u200b', '\u200b');
                                embed.addField("Name:","**"+rows[i].petname+"**");
                                embed.addField("Power Level:",rows[i].power);
                                embed.addField("Price:",rows[i].price,true);
                                embed.addField("Pet HP:",rows[i].pethp,true);
                                embed.addField("Extra Attack:",rows[i].petatk,true);
                            }
                        }
                        message.channel.send(embed);
                    })
                }
                break;
               
            case "petbuy":
            case "buypet":
                if (args[2]!=null){
                    if (day == 25 && message.channel.name == "davys-petshop"){
                        con.query("SELECT * FROM petshop WHERE petname= '"+args[2].toUpperCase()+"' AND month = "+month+" OR  petname= '"+args[2].toUpperCase()+"' AND month = 0",(err,rows) =>{
                           if (err) throw err;
                           if (rows.length<1){
                               message.reply("**Davy**: Sorry there bud but I could not find a pet called **"+args[2]+"**. Maybe I haven't caught one yet..");
                           }
                           else{
                               var price = rows[0].price;
                               con.query("SELECT * FROM inventory WHERE id = '"+message.author.id+"'",(err1,rows1) =>{
                                if (err1) throw err1;    
                                var currcrystal = rows1[0].crystals;
                                    if (currcrystal>=price){
                                        message.reply("**Davy**: Fond of **"+args[2]+"now? Here, you can have it.\nYour storage has been updated.");
                                        message.channel.send("**"+message.author.username+"** has bought **"+args[2]+"**");
                                        var updatecrystals = "UPDATE inventory SET crystals = "+(currcrystal-price)+" WHERE id = '"+message.author.id+"'";
                                        con.query(updatecrystals);
                                    }
                                    else{
                                        var replyarray = ["I don't do bargaining champ, you might want to take your business somewhere else.",
                                        "Oh wow! you want me to give what took so long to catch and you have nothing to give back?",
                                        "haha sure.. is this an insult? Show me the money champ.",
                                        "I don't participate in charity events, so don't expect me to give you something..",
                                        "Sir, I don't speak the language of the broke."]
                                        var num = Math.floor(Math.random() * 5 + 0);
                                        message.reply("**Davy**: "+replyarray[num]);
                                    }
                                })
                           }
                        })
                    }
                }
                else{
                    message.reply("Please specify the pet's name.");
                }
                break;

            case "craft":
                if (args[2]==null){
                    con.query("SELECT * FROM craft WHERE pageno = 1",(err1,rows1) =>{
                        if (err1) throw err1;
                        var itemstring;
                        var limit = rows1.length;
                        const embed = new Discord.MessageEmbed()
                        .setTitle("Craftable Materials:")
                        .setDescription("These are the items that can be crafted. 1 out of 2 pages. Enter **"+prefix+" craft p2** to check page 2.")
                        .setFooter("Do **"+prefix+" craft itemnumber** to craft the item.") 
                        .setColor("#add8e6")
                        //.setThumbnail(image)
                        for (i=0;i<limit;i++){
                            embed.addField("Name:",rows1[i].name,true);
                            embed.addField("Item Number:",rows1[i].number,true);
                            itemstring = "Requirement 1:"+rows1[i].item1+" x"+rows1[i].quantity1+"\n";
                            if (rows1[i].item2!=null){
                                itemstring+="Requirement 2:"+rows1[i].item2+" x"+rows1[i].quantity2+"\n";
                            }
                            if (rows1[i].item3!=null){
                                itemstring+="Requirement 3:"+rows1[i].item3+" x"+rows1[i].quantity3+"\n";
                            }
                            embed.addField("Requirements",itemstring,true);
                        }
                        message.channel.send(embed);
                    })
                }

                else if (args[2]=="p1"){
                    con.query("SELECT * FROM craft WHERE pageno = 1",(err1,rows1) =>{
                        if (err1) throw err1;
                        var itemstring;
                        var limit = rows1.length;
                        const embed = new Discord.MessageEmbed()
                        .setTitle("Craftable Materials:")
                        .setDescription("These are the items that can be crafted. 1 out of 2 pages. Enter **"+prefix+" craft p2** to check page 2.")
                        .setFooter("Do **"+prefix+" craft itemnumber** to craft the item.") 
                        .setColor("#add8e6")
                        //.setThumbnail(image)
                        for (i=0;i<limit;i++){
                            embed.addField("Name:",rows1[i].name,true);
                            embed.addField("Item Number:",rows1[i].number,true);
                            itemstring = "Requirement 1:"+rows1[i].item1+" x"+rows1[i].quantity1+"\n";
                            if (rows1[i].item2!=null){
                                itemstring+="Requirement 2:"+rows1[i].item2+" x"+rows1[i].quantity2+"\n";
                            }
                            if (rows1[i].item3!=null){
                                itemstring+="Requirement 3:"+rows1[i].item3+" x"+rows1[i].quantity3+"\n";
                            }
                            embed.addField("Requirements",itemstring,true);
                        }
                        message.channel.send(embed);
                    })
                }

                else if (args[2]=="p2"){
                    con.query("SELECT * FROM craft WHERE pageno = 2",(err1,rows1) =>{
                        if (err1) throw err1;
                        var itemstring;
                        var limit = rows1.length;
                        const embed = new Discord.MessageEmbed()
                        .setTitle("Craftable Materials:")
                        .setDescription("These are the items that can be crafted. 2 out of 2 pages.")
                        .setFooter("Do **"+prefix+" craft itemnumber** to craft the item.") 
                        .setColor("#add8e6")
                        //.setThumbnail(image)
                        for (i=0;i<limit;i++){
                            embed.addField("Name:",rows1[i].name,true);
                            embed.addField("Item Number:",rows1[i].number,true);
                            itemstring = "Requirement 1:"+rows1[i].item1+" x"+rows1[i].quantity1+"\n";
                            if (rows1[i].item2!=null){
                                itemstring+="Requirement 2:"+rows1[i].item2+" x"+rows1[i].quantity2+"\n";
                            }
                            if (rows1[i].item3!=null){
                                itemstring+="Requirement 3:"+rows1[i].item3+" x"+rows1[i].quantity3+"\n";
                            }
                            embed.addField("Requirements",itemstring,true);
                        }
                        message.channel.send(embed);
                    })
                }

                else{
                    var entered = parseInt(args[2]);
                    console.log(entered);
                    console.log(typeof entered)
                    if (!isNaN(entered)){
                        con.query("SELECT * FROM craft WHERE number = "+args[2],(err2,rows2) =>{
                            
                            if (err2) throw err2;
                            if (rows2.length<1){
                                message.reply("Item not found. Enter another item number, which can be craftable.");
                            }

                            else{
                                var craftitem = rows2[0].name;
                                var firstitem = rows2[0].item1;
                                var seconditem = rows2[0].item2;
                                var thirditem = rows2[0].item3;
                                var firstquantity = rows2[0].quantity1;
                                var secondquantity = rows2[0].quantity2;
                                var thirdquantity = rows2[0].quantity3;
                                var ok = 0;
                                con.query("SELECT * FROM storage WHERE user = "+message.author.id,(err3,rows3) =>{
                                    if (err3) throw err3;
                                    var itemsinstorage = rows3.length;
                                    
                                    con.query("SELECT * FROM storage WHERE user = "+message.author.id+" AND itemname = '"+firstitem+"'",(err4,rows4) =>{
                                        if (rows4.length>=1 && rows4[0].quantity>=firstquantity){
                                            con.query("SELECT * FROM storage WHERE user = "+message.author.id+" AND itemname = '"+seconditem+"'",(err5,rows5) =>{
                                                if ((rows5.length>=1 && rows5[0].quantity>=secondquantity)|| seconditem==null){
                                                    con.query("SELECT * FROM storage WHERE user = "+message.author.id+" AND itemname = '"+thirditem+"'",(err6,rows6) =>{
                                                        if ((rows6.length>=1 && rows6[0].quantity>=thirdquantity)|| thirditem==null){
                                                            message.reply(craftitem+" has been crafted and added to your inventory.");
                                                            var updateitem1quantity = "";
                                                            var updateitem2quantity = "";
                                                            var updateitem3quantity = "";
                                                            if (rows4[0].quantity-firstquantity>0){
                                                                updateitem1quantity="UPDATE storage SET quantity ="+(rows4[0].quantity-firstquantity)+" WHERE itemname = '"+firstitem+"' AND user ='"+message.author.id+"'";
                                                                con.query(updateitem1quantity);
                                                            }
                                                            else{
                                                                con.query("SELECT * FROM craft WHERE number = "+args[2],(err2,rows2) =>{
                                                                    
                                                                    updateitem1quantity="DELETE FROM storage WHERE itemname = '"+rows2[0].item1+"' AND user ='"+message.author.id+"'";
                                                                    con.query(updateitem1quantity);
                                                                })
                                                            }
                                                            if (rows5.length>= 1){

                                                                if (rows5[0].quantity-secondquantity>0){
                                                                    updateitem2quantity="UPDATE storage SET quantity ="+(rows5[0].quantity-secondquantity)+" WHERE itemname = '"+seconditem+"' AND user ='"+message.author.id+"'";
                                                                    con.query(updateitem2quantity);
                                                                }
                                                                else{
                                                                    con.query("SELECT * FROM craft WHERE number = "+args[2],(err2,rows2) =>{
                                                                        updateitem2quantity="DELETE FROM storage WHERE itemname = '"+rows2[0].item2+"' AND user ='"+message.author.id+"'";
                                                                        con.query(updateitem2quantity);
                                                                    })
                                                                }
                                                            }
                                                            if (rows6.length>= 1){
                                                                if (rows6[0].quantity-thirdquantity>0){
                                                                    updateitem3quantity="UPDATE storage SET quantity ="+(rows6[0].quantity-thirdquantity)+" WHERE itemname = '"+thirditem+"' AND user ='"+message.author.id+"'";
                                                                    con.query(updateitem3quantity);
                                                                }
                                                                else{
                                                                    con.query("SELECT * FROM craft WHERE number = "+args[2],(err2,rows2) =>{
                                                                        updateitem3quantity="DELETE FROM storage WHERE itemname = '"+rows2[0].item3+"' AND user ='"+message.author.id+"'";
                                                                        con.query(updateitem3quantity);
                                                                    })
                                                                }
                                                            }
                                                            
                                                            con.query("SELECT * FROM storage WHERE user = '"+message.author.id+"'",(err7,rows7) =>{
                                                                if (err7) throw err7;
                                                                if (rows7.length<1){
                                                                    con.query("SELECT * FROM item WHERE name = "+craftitem+"",(err14,rows14) =>{
                                                                        if (err14) throw err14;
                                                                        var itemsname = rows14[0].name;
                                                                        var sql = "INSERT INTO storage VALUES ('"+message.author.id+"','"+itemnumber+"','"+itemsname+"',1,1)";
                                                                        con.query(sql);
                                                                        con.query("SELECT * FROM inventory WHERE id = '"+message.author.id+"'",(err12,rows12) =>{
                                                                            if (err12) throw err12;
                                                                        
                                                                            var itemsininventory = rows12[0].items;
                                                                            if (itemsininventory==null){
                                                                                var newlistofitems = itemnumber;
                                                                            }
                                                                            else{
                                                                                var newlistofitems = itemsininventory+","+itemnumber;
                                                                            }
                                                                            var sql2 = "UPDATE inventory set items='"+newlistofitems+"' WHERE id = '"+message.author.id+"'";
                                                                            console.log("newlistofitems: "+newlistofitems);
                                                                            con.query(sql2);
                                                                        })
                                                                    })
                                                                }
                                                                else{
                                                                    con.query("SELECT * FROM storage WHERE user = '"+message.author.id+"' AND itemname ='"+craftitem+"'",(err7,rows7) =>{
                                                                        if (err7) throw err7;
                                                                        if (rows7.length<1){
                                                                            
                                                                            con.query("SELECT * FROM item WHERE name = '"+craftitem+"'",(err14,rows14) =>{
                                                                                var itemnumber = rows14[0].number;
                                                                                con.query("SELECT * FROM storage WHERE user = '"+message.author.id+"'",(err15,rows15) =>{
                                                                                    var rowsintable = rows15.length;
                                                                                    if (err14) throw err14;
                                                                                    var itemsname = craftitem;
                                                                                    var sql = "INSERT INTO storage VALUES ('"+message.author.id+"','"+itemnumber+"','"+itemsname+"',1,1)";
                                                                                    if (rowsintable>8){
                                                                                        sql = "INSERT INTO storage VALUES ('"+message.author.id+"','"+itemnumber+"','"+itemsname+"',1,2)";
                                                                                    }
                                                                                    else if (rowsintable>16){
                                                                                        sql = "INSERT INTO storage VALUES ('"+message.author.id+"','"+itemnumber+"','"+itemsname+"',1,3)";
                                                                                    }
                                                                                    else if (rowsintable>24){
                                                                                        sql = "INSERT INTO storage VALUES ('"+message.author.id+"','"+itemnumber+"','"+itemsname+"',1,4)";
                                                                                    }
                                                                                    else if (rowsintable>32){
                                                                                        sql = "INSERT INTO storage VALUES ('"+message.author.id+"','"+itemnumber+"','"+itemsname+"',1,5)";
                                                                                    }
                                                                                    else if (rowsintable>40){
                                                                                        sql = "INSERT INTO storage VALUES ('"+message.author.id+"','"+itemnumber+"','"+itemsname+"',1,6)";
                                                                                    }
                                                                                    else if (rowsintable>48){
                                                                                        sql = "INSERT INTO storage VALUES ('"+message.author.id+"','"+itemnumber+"','"+itemsname+"',1,7)";
                                                                                    }
                                                                                    con.query(sql);
                                                                                    con.query("SELECT * FROM inventory WHERE id = '"+message.author.id+"'",(err9,rows9) =>{
                                                                                        if (err9) throw err9;
                                                                                    
                                                                                        var itemsininventory = rows9[0].items;
                                                                                    
                                                                                        var newlistofitems = itemsininventory+","+itemnumber;
                                                                                        var sql2 = "UPDATE inventory set items='"+newlistofitems+"' WHERE id = '"+message.author.id+"'";
                                                                                        console.log("newlistofitems: "+newlistofitems);
                                                                                        con.query(sql2);
                                                                                    })
                                                                                })
                                                                            })
                                                                            
                                                                        }
                                                                        else{
                                                                            
                                                                            var newitemquantity = ((rows7[0].quantity) + 1);
                                                                            var sql = "UPDATE storage SET quantity ="+newitemquantity+" WHERE user = '"+message.author.id+"' AND itemname ='"+craftitem+"'";
                                                                            con.query(sql);
                                                                        }
                                                                    })
                                                                }
                                                            })
                                                        }
                                                        else{
                                                            message.reply("You do not have adequate amounts of **"+thirditem+"** to craft "+craftitem+".");
                                                        }
                                                    })
                                                }
                                                else{
                                                    
                                                    message.reply("You do not have adequate amounts of **"+seconditem+"** to craft "+craftitem+".");
                                                }
                                            })                                                
                                        }
                                        else{
                                            message.reply("You do not have adequate amounts of **"+firstitem+"** to craft "+craftitem+".");
                                        }
                                    })
                                
                                })
                            }
                        })
                    }
                    else{
                        message.reply("Enter the item number of the item to be crafted.\nExample: **"+prefix+" craft 7**." );
                        console.log(entered);
                    }
                }
                break;
            case "consume":
            case "eat":
            case "drink":
            case "use":
                var quantityentered = 1;
                args2 = parseInt(args[2]);
                args3 = parseInt(args[3]);
                if (args[3]!= null && !isNaN(args3)){
                    quantityentered = args[3];
                }
                
                if (args[2]!=null && !isNaN(args2)){
                    con.query("SELECT * FROM storage WHERE user = '"+message.author.id+"' AND item = "+args2,(err,rows) =>{
                        if (err) throw err;
                        if (rows.length<1){
                            message.reply("You do not own this item.");
                        }
                        else{
                            var availablequantity = rows[0].quantity;
                            if (availablequantity<quantityentered){
                                message.reply("You only own "+availablequantity+" of this item.");
                            }
                            else{
                                con.query("SELECT * FROM item WHERE number = "+args[2],(err1,rows1) =>{
                                    if (err1) throw err1;
                                    var type = rows1[0].type;
                                    var selecteditem = rows1[0].name;
                                    if (type=="consumable"|| type == "consumable(hidden)" || type== "consumable/craftable"){
                                        if (selecteditem=="Debuff Nullification Potion"){
                                            var deldebuffsql = "DELETE FROM debuff WHERE user = '"+message.author.id+"'";
                                            var delerasesql = "DELETE FROM erase WHERE user = '"+message.author.id+"'";
                                            con.query(deldebuffsql);
                                            con.query(delerasesql);
                                        }
                                        var extraa = rows1[0].extraatk;
                                        var extrah = rows1[0].extrahp;
                                        extraa = parseInt(extraa);
                                        extrah=parseInt(extrah);
                                        con.query("SELECT * FROM fightstat WHERE name = '"+message.author.id+"'",(err2,rows2) =>{
                                            if (err2) throw err2;
                                            var currextraatk = rows2[0].extraatk;
                                            var currextrahp = rows2[0].extrahp;
                                            currextraatk = parseInt(currextraatk);
                                            currextrahp = parseInt(currextrahp);
                                            var increasestat = "UPDATE fightstat SET extraatk = "+(extraa+currextraatk)+", extrahp = "+(extrah+currextrahp)+" WHERE name = '"+message.author.id+"'";
                                            con.query(increasestat);
                                            var decreasequantity;
                                            if (availablequantity-quantityentered==0){
                                                decreasequantity = "DELETE FROM storage WHERE item = "+args[2]+" AND user = '"+message.author.id+"'";
                                            }
                                            else{
                                                decreasequantity = "UPDATE storage SET quantity = "+(availablequantity-quantityentered)+" WHERE user = '"+message.author.id+"' AND item = "+args[2];

                                            }
                                            con.query(decreasequantity);
                                            message.reply("You have consumed **"+quantityentered+" "+selecteditem+"**.");
                                        })
                                    }
                                    else{
                                        message.reply("You cannot consume this item.");
                                    
                                    }
                                })
                            }
                        }
                    })
                }
                else{
                    message.reply("Enter the item number of the item you want to consume.\nExample: **"+prefix+" consume 15**.");
                }
               
                break;

            case "shop":
            case "bazaar":
                if (args[2]!=null && args[2].toLowerCase() =="p1"){
                    var georgiearray = ["What ya want?",
                    "Aren't you fat already? You don't seem to mind it do you?",
                    "Oh look who's here... a customer...",
                    "Yeah go ahead, waste my time",
                    "All they do is eat and complain.. oh here's another one.",
                    "I almost wanna increase price 100 folds so you just stop coming here.",
                    "A drunk walks into a bar.. oh wait looks like they stopped at the wrong shop.",
                    "Wish mom took care of this stall too so I don't need to babysit these adults.",
                    "Sup."];
                    var num = Math.floor(Math.random() * georgiearray.length);
                    con.query("SELECT * FROM item WHERE type = 'consumable' OR type = 'consumable/craftable'",(err,rows) =>{
                        if (err) throw err;
                        const embed = new Discord.MessageEmbed()
                        .setTitle("Consumable Stall:")
                        .setDescription("**Georgie**: "+georgiearray[num])
                        .setFooter("Do "+prefix+" buy itemnumber to buy the item.") 
                        .setColor("#add8e6")
                        for (i=0;i<rows.length;i++){
                            embed.addField("**"+rows[i].number+"**",rows[i].name+".\nPrice: **"+rows[i].crystalworth+"**",true);
                        }
                        message.channel.send(embed);
                    })
                }
                else if (args[2]!=null && args[2].toLowerCase() =="p2"){
                    var xanderarray = ["A hunter hunts, preys die and heroes like you help the prey from being hunted. What can I help you with, hero?",
                    "I shall be loyal to the kingdom and every soldier that serves the kingdom along with me.",
                    "I will give away all that I have to prove my loyalty to the kingdom.",
                    "I wish to be remotely as heroic as you, fighter.",
                    "These may be expensive for regular citizens but I have lowered the price for you, hero."];
                    var num = Math.floor(Math.random() * xanderarray.length);
                    con.query("SELECT * FROM item WHERE type = 'main weapon' OR type = 'off weapon' OR type = 'attire' OR type = 'mask' OR type = 'ring' OR type = 'necklace'",(err,rows) =>{
                        if (err) throw err;
                        const embed = new Discord.MessageEmbed()
                        .setTitle("Weaponry Stall:")
                        .setDescription("**Xander**: "+xanderarray[num])
                        .setFooter("Do "+prefix+" buy itemnumber to buy the item.") 
                        .setColor("#add8e6")
                        for (i=0;i<rows.length;i++){
                            embed.addField("**"+rows[i].number+"**",rows[i].name+".\nPrice: **"+rows[i].crystalworth+"**",true);
                        }
                        message.channel.send(embed);
                    })
                }
                else if (args[2]!=null && args[2].toLowerCase() =="p3"){
                    var rosearray = ["Hello Hello there!",
                    "What can I do for you, child?",
                    "Sugar is something wrong?",
                    "Roses are red, violets are blue and how may I help a cutie like you?",
                    "You remind me of my child Georgie.. he works hard like you!",
                    "I respect anyone who respects plants.",
                    "Since the soil around the kingdom is blessed with magic, farming is simple!"];
                    var num = Math.floor(Math.random() * rosearray.length + 0);
                    con.query("SELECT * FROM item WHERE type = 'seed' OR type = 'craftable/seed'",(err,rows) =>{
                        if (err) throw err;
                        const embed = new Discord.MessageEmbed()
                        .setTitle("Gardening Stall:")
                        .setDescription("**Rose**: "+rosearray[num])
                        .setFooter("Do "+prefix+" buy itemnumber to buy the item.") 
                        .setColor("#add8e6")
                        for (i=0;i<rows.length;i++){
                            embed.addField("**"+rows[i].number+"**",rows[i].name+".\nPrice: **"+rows[i].crystalworth+"**",true);
                        }
                        message.channel.send(embed);
                    })
                }
                else if (args[2]!=null && args[2].toLowerCase() =="p4"){
                    var rakimarray = [""]
                    var num = Math.floor(Math.random() * rakimarray.length + 0);
                    con.query("SELECT * FROM item WHERE type = 'skillpage'",(err,rows) =>{
                        if (err) throw err;
                        const embed = new Discord.MessageEmbed()
                        .setTitle("Skillpage Stall:")
                        .setDescription("**Rakim**: "+rakimarray[num])
                        .setFooter("Do "+prefix+" buy itemnumber to buy the item.") 
                        .setColor("#add8e6")
                        for (i=0;i<rows.length;i++){
                            embed.addField("**"+rows[i].number+"**",rows[i].name+".\nPrice: **"+rows[i].crystalworth+"**",true);
                        }
                        message.channel.send(embed);
                    })
                }
                else if (args[2]!=null && args[2].toLowerCase() =="p5"){
                    var harryarray = ["Soldiers have a variety of skills is what I have heard!",
                    "Know a bit of crafting now do you? How wonderful!",
                    "Did you know most of the craftable items are from monsters?",
                    "I wish I can hunt too, would be good for the business.",
                    "Prices are pretty low here, help yourself!."]
                    var num = Math.floor(Math.random() * harryarray.length + 0);
                    con.query("SELECT * FROM item WHERE type = 'craftable' OR type = 'consumable/craftable'",(err,rows) =>{
                        if (err) throw err;
                        const embed = new Discord.MessageEmbed()
                        .setTitle("Skillpage Stall:")
                        .setDescription("**Harry**: "+harryarray[num])
                        .setFooter("Do "+prefix+" buy itemnumber to buy the item.") 
                        .setColor("#add8e6")
                        for (i=0;i<rows.length;i++){
                            embed.addField("**"+rows[i].number+"**",rows[i].name+".\nPrice: **"+rows[i].crystalworth+"**",true);
                        }
                        message.channel.send(embed);
                    })
                }
                else{
                    const embed = new Discord.MessageEmbed()
                    .setTitle("Craftable Materials:")
                    .setDescription("You can find many items needed in the shopping district of the kingdom.")
                    .setColor("#add8e6")
                    .addField("\u200b","`"+prefix+" shop p1` \nConsumable/Food Stall.")
                    .addField("\u200b","`"+prefix+" shop p2` \nGear/Equippable Stall.")
                    .addField("\u200b","`"+prefix+" shop p3` \nGardening Stall.")
                    .addField("\u200b","`"+prefix+" shop p4` \nSkill Pages.")
                    .addField("\u200b","`"+prefix+" shop p5` \nCraftable Stall.");
                    message.channel.send(embed);
                }
                break;

            case "buy":
            case "purchase":
                if (args[2]==null || isNaN(args[2])){
                    message.reply("Enter valid item number.\nExample: **"+prefix+" buy 15**.");
                }
                else{
                    var itemnumber = parseInt(args[2]);
                    con.query("SELECT * FROM item WHERE number = "+itemnumber,(err,rows) =>{
                        if (err) throw err;
                        if (rows.length<1){
                            message.reply("Item number is non existant.");
                        }
                        else{
                            var type = rows[0].type;
                            var priceofitem = rows[0].crystalworth;
                            if (!type.endsWith("(hidden)")){
                                con.query("SELECT * FROM inventory WHERE id = '"+message.author.id+"'",(err1,rows1) =>{
                                    if (err1) throw err1;
                                    var currcrystal = rows1[0].crystals;
                                    if (priceofitem>currcrystal){
                                        message.reply("You do not have enough crystals to buy this item.");
                                    }
                                    else{
                                        con.query("SELECT * FROM item WHERE number = "+itemnumber,(err13,rows13) =>{
                                            if (err13) throw err13;
                                            var itemname = rows13[0].name;
                                            
                                            message.reply("You bought **1 "+itemname+"**");
                                            var updatecrystals = "UPDATE inventory SET crystals = "+(currcrystal-priceofitem)+" WHERE id = '"+message.author.id+"'";
                                            con.query(updatecrystals);
                                            con.query("SELECT * FROM storage WHERE user = '"+message.author.id+"'",(err6,rows6) =>{
                                                if (err6) throw err6;
                                                if (rows6.length<1){
                                                    con.query("SELECT * FROM item WHERE number = "+itemnumber+"",(err14,rows14) =>{
                                                        if (err14) throw err14;
                                                        var itemsname = rows14[0].name;
                                                        var sql = "INSERT INTO storage VALUES ('"+message.author.id+"','"+itemnumber+"','"+itemsname+"',1,1)";
                                                        con.query(sql);
                                                        con.query("SELECT * FROM inventory WHERE id = '"+message.author.id+"'",(err12,rows12) =>{
                                                            if (err12) throw err12;
                                                        
                                                            var itemsininventory = rows12[0].items;
                                                            if (itemsininventory==null){
                                                                var newlistofitems = itemnumber;
                                                            }
                                                            else{
                                                                var newlistofitems = itemsininventory+","+itemnumber;
                                                            }
                                                            var sql2 = "UPDATE inventory set items='"+newlistofitems+"' WHERE id = '"+message.author.id+"'";
                                                            console.log("newlistofitems: "+newlistofitems);
                                                            con.query(sql2);
                                                        })
                                                    })
                                                }
                                                else{
                                                    con.query("SELECT * FROM storage WHERE user = '"+message.author.id+"' AND item ="+itemnumber,(err7,rows7) =>{
                                                        if (err7) throw err7;
                                                        if (rows7.length<1){
                                                            
                                                            con.query("SELECT * FROM item WHERE number = "+itemnumber+"",(err14,rows14) =>{
                                                                con.query("SELECT * FROM storage WHERE user = '"+message.author.id+"'",(err15,rows15) =>{
                                                                    var rowsintable = rows15.length;
                                                                    if (err14) throw err14;
                                                                    var itemsname = rows14[0].name;
                                                                    var sql = "INSERT INTO storage VALUES ('"+message.author.id+"','"+itemnumber+"','"+itemsname+"',1,1)";
                                                                    if (rowsintable>=7){
                                                                        sql = "INSERT INTO storage VALUES ('"+message.author.id+"','"+itemnumber+"','"+itemsname+"',1,2)";
                                                                    }
                                                                    else if (rowsintable>=14){
                                                                        sql = "INSERT INTO storage VALUES ('"+message.author.id+"','"+itemnumber+"','"+itemsname+"',1,3)";
                                                                    }
                                                                    else if (rowsintable>=21){
                                                                        sql = "INSERT INTO storage VALUES ('"+message.author.id+"','"+itemnumber+"','"+itemsname+"',1,4)";
                                                                    }
                                                                    else if (rowsintable>=28){
                                                                        sql = "INSERT INTO storage VALUES ('"+message.author.id+"','"+itemnumber+"','"+itemsname+"',1,5)";
                                                                    }
                                                                    else if (rowsintable>=35){
                                                                        sql = "INSERT INTO storage VALUES ('"+message.author.id+"','"+itemnumber+"','"+itemsname+"',1,6)";
                                                                    }
                                                                    else if (rowsintable>=42){
                                                                        sql = "INSERT INTO storage VALUES ('"+message.author.id+"','"+itemnumber+"','"+itemsname+"',1,7)";
                                                                    }
                                                                    con.query(sql);
                                                                    con.query("SELECT * FROM inventory WHERE id = '"+message.author.id+"'",(err9,rows9) =>{
                                                                        if (err9) throw err9;
                                                                    
                                                                        var itemsininventory = rows9[0].items;
                                                                    
                                                                        var newlistofitems = itemsininventory+","+itemnumber;
                                                                        var sql2 = "UPDATE inventory set items='"+newlistofitems+"' WHERE id = '"+message.author.id+"'";
                                                                        console.log("newlistofitems: "+newlistofitems);
                                                                        con.query(sql2);
                                                                    })
                                                                })
                                                            })
                                                            
                                                        }
                                                        else{
                                                            console.log("item drop working 2");
                                                            var newitemquantity = ((rows7[0].quantity) + 1);
                                                            var sql = "UPDATE storage SET quantity ="+newitemquantity+" WHERE user = '"+message.author.id+"' AND item ="+itemnumber;
                                                            con.query(sql);
                                                        }
                                                    })
                                                }
                                            })
                                        })
                                    }
                                })
                            }
                            else{
                                message.reply("Item not found in the shop.");
                            }
                        }
                    })
                }
                break;

            case "id":
                message.reply("ID is: "+message.author.id);
                break;
            
            case "equip":
            case "wear":
            case "put":
                if (args[2]!= null && !isNaN(args[2])){
                    con.query("SELECT * FROM storage WHERE item ="+args[2]+" AND user = '"+message.author.id+"'",(err,rows)=>{
                        if (err) throw err;
                        if (rows.length<1){
                            message.reply("You do not own this item.");
                        }
                        else{
                            var quantityown = parseInt(rows[0].quantity);
                            con.query("SELECT * FROM item WHERE number ="+args[2],(err1,rows1)=>{
                                if (err1) throw err1;
                                var extraaofitem = parseInt(rows1[0].extraatk);
                                var extrahofitem = parseInt(rows1[0].extrahp);
                                var itemtype = rows1[0].type;
                                var itemname = rows1[0].name;
                                var itemrole = rows1[0].role;
                                con.query("SELECT * FROM user WHERE name ='"+message.author.id+"'",(err0,rows0)=>{
                                    var userrole = rows0[0].role;
                                    if (userrole==itemrole || itemrole == "all"){
                                        if (itemtype=="main weapon" 
                                        || itemtype == "main weapon(hidden)" 
                                        || itemtype == "off weapon" 
                                        || itemtype == "off weapon(hidden)" 
                                        || itemtype == "necklace" 
                                        || itemtype == "necklace(hidden)" 
                                        || itemtype == "ring" 
                                        || itemtype =="ring(hidden)" 
                                        || itemtype == "pet" 
                                        || itemtype =="attire" 
                                        || itemtype == "attire(hidden)" 
                                        || itemtype == "mask" 
                                        || itemtype == "mask(hidden)"){
                                            message.reply("The equipped item will be destroyed when equipping a new item.\nDo you want to continue? (yes/no)");
                                            var guy = message.author.id;
                                            var notanswered = true;
                                            bot.on('message', async message => {
                                                
                                                if (message.author.id==guy){
                                                    if (message.content.toLowerCase() === `yes` && notanswered) {
                                                        try{
                                                            var equipsql;
                                                            var extrastatsql;
                                                            var deletesql;
                                                            notanswered = false;
                                                            if (itemtype == "ring" || itemtype == "ring(hidden)"){
                                                                con.query("SELECT * FROM gear WHERE user = '"+message.author.id+"'",(err2,rows2)=>{
                                                                    if (rows2.lenght<1){
                                                                        message.reply("Please select a role before trying to equip an item.");
                                                                    }
                                                                    else{
                                                                        if (rows2[0].ring1 == null){
                                                                            equipsql = "UPDATE gear SET ring1 = '"+itemname+"' WHERE user = '"+guy+"'";
                                                                            con.query(equipsql);
                                                                            con.query("SELECT * FROM fightstat WHERE name = '"+message.author.id+"'",(err3,rows3)=>{
                                                                                if (err3) throw err3;
                                                                                var currextraatk = parseInt(rows3[0].extraatk);
                                                                                var currextrahp = parseInt(rows3[0].extrahp);
                                                                                extrastatsql = "UPDATE fightstat SET extraatk = "+(currextraatk+extraaofitem)+", extrahp = "+(currextrahp+extrahofitem)+" WHERE name = '"+message.author.id+"'";
                                                                                con.query(extrastatsql);
                                                                                message.reply("**"+itemname+" **is equipped as **Ring 1**.");
                                                                                if (quantityown==1){
                                                                                    deletesql = "DELETE FROM storage WHERE user = '"+message.author.id+"' AND item ="+args[2];
                                                                                    con.query(deletesql);
                                                                                }
                                                                                else{
                                                                                    deletesql = "UPDATE storage SET quantity ="+(quantityown-1)+" WHERE item = "+args[2]+" AND user ='"+message.author.id+"'";
                                                                                    con.query(deletesql);
                                                                                }
                                                                            })
                                                                        }
                                                                        else if (rows2[0].ring2 == null){
                                                                            equipsql = "UPDATE gear SET ring2 = '"+itemname+"' WHERE user = '"+guy+"'";
                                                                            con.query(equipsql);
                                                                            con.query("SELECT * FROM fightstat WHERE name = '"+message.author.id+"'",(err3,rows3)=>{
                                                                                if (err3) throw err3;
                                                                                var currextraatk = parseInt(rows3[0].extraatk);
                                                                                var currextrahp = parseInt(rows3[0].extrahp);
                                                                                extrastatsql = "UPDATE fightstat SET extraatk = "+(currextraatk+extraaofitem)+", extrahp = "+(currextrahp+extrahofitem)+" WHERE name = '"+message.author.id+"'";
                                                                                con.query(extrastatsql);
                                                                                message.reply("**"+itemname+" **is equipped as **Ring 2**.");
                                                                                if (quantityown==1){
                                                                                    deletesql = "DELETE FROM storage WHERE user = '"+message.author.id+"' AND item ="+args[2];
                                                                                    con.query(deletesql);
                                                                                }
                                                                                else{
                                                                                    deletesql = "UPDATE storage SET quantity ="+(quantityown-1)+" WHERE item = "+args[2]+" AND user ='"+message.author.id+"'";
                                                                                    con.query(deletesql);
                                                                                }
                                                                            })
                                                                        }
                                                                        else if (rows2[0].ring3 == null){
                                                                            equipsql = "UPDATE gear SET ring3 = '"+itemname+"' WHERE user = '"+guy+"'";
                                                                            con.query(equipsql);
                                                                            con.query("SELECT * FROM fightstat WHERE name = '"+message.author.id+"'",(err3,rows3)=>{
                                                                                if (err3) throw err3;
                                                                                var currextraatk = parseInt(rows3[0].extraatk);
                                                                                var currextrahp = parseInt(rows3[0].extrahp);
                                                                                extrastatsql = "UPDATE fightstat SET extraatk = "+(currextraatk+extraaofitem)+", extrahp = "+(currextrahp+extrahofitem)+" WHERE name = '"+message.author.id+"'";
                                                                                con.query(extrastatsql);
                                                                                message.reply("**"+itemname+" **is equipped as **Ring 3**.");
                                                                                if (quantityown==1){
                                                                                    deletesql = "DELETE FROM storage WHERE user = '"+message.author.id+"' AND item ="+args[2];
                                                                                    con.query(deletesql);
                                                                                }
                                                                                else{
                                                                                    deletesql = "UPDATE storage SET quantity ="+(quantityown-1)+" WHERE item = "+args[2]+" AND user ='"+message.author.id+"'";
                                                                                    con.query(deletesql);
                                                                                }
                                                                            })
                                                                        }
                                                                        else if (rows2[0].ring4 == null){
                                                                            equipsql = "UPDATE gear SET ring4 = '"+itemname+"' WHERE user = '"+guy+"'";
                                                                            con.query(equipsql);
                                                                            con.query("SELECT * FROM fightstat WHERE name = '"+message.author.id+"'",(err3,rows3)=>{
                                                                                if (err3) throw err3;
                                                                                var currextraatk = parseInt(rows3[0].extraatk);
                                                                                var currextrahp = parseInt(rows3[0].extrahp);
                                                                                extrastatsql = "UPDATE fightstat SET extraatk = "+(currextraatk+extraaofitem)+", extrahp = "+(currextrahp+extrahofitem)+" WHERE name = '"+message.author.id+"'";
                                                                                con.query(extrastatsql);
                                                                                message.reply("**"+itemname+" **is equipped as **Ring 4**.");
                                                                                if (quantityown==1){
                                                                                    deletesql = "DELETE FROM storage WHERE user = '"+message.author.id+"' AND item ="+args[2];
                                                                                    con.query(deletesql);
                                                                                }
                                                                                else{
                                                                                    deletesql = "UPDATE storage SET quantity ="+(quantityown-1)+" WHERE item = "+args[2]+" AND user ='"+message.author.id+"'";
                                                                                    con.query(deletesql);
                                                                                }
                                                                            })
                                                                        }
                                                                        else if (rows2[0].ring5 == null){
                                                                            equipsql = "UPDATE gear SET ring5 = '"+itemname+"' WHERE user = '"+guy+"'";
                                                                            con.query(equipsql);
                                                                            con.query("SELECT * FROM fightstat WHERE name = '"+message.author.id+"'",(err3,rows3)=>{
                                                                                if (err3) throw err3;
                                                                                var currextraatk = parseInt(rows3[0].extraatk);
                                                                                var currextrahp = parseInt(rows3[0].extrahp);
                                                                                extrastatsql = "UPDATE fightstat SET extraatk = "+(currextraatk+extraaofitem)+", extrahp = "+(currextrahp+extrahofitem)+" WHERE name = '"+message.author.id+"'";
                                                                                con.query(extrastatsql);
                                                                                message.reply("**"+itemname+" **is equipped as **Ring 5**.");
                                                                                if (quantityown==1){
                                                                                    deletesql = "DELETE FROM storage WHERE user = '"+message.author.id+"' AND item ="+args[2];
                                                                                    con.query(deletesql);
                                                                                }
                                                                                else{
                                                                                    deletesql = "UPDATE storage SET quantity ="+(quantityown-1)+" WHERE item = "+args[2]+" AND user ='"+message.author.id+"'";
                                                                                    con.query(deletesql);
                                                                                }
                                                                            })
                                                                        }
                                                                        else if (rows2[0].ring6 == null){
                                                                            equipsql = "UPDATE gear SET ring6 = '"+itemname+"' WHERE user = '"+guy+"'";
                                                                            con.query(equipsql);
                                                                            con.query("SELECT * FROM fightstat WHERE name = '"+message.author.id+"'",(err3,rows3)=>{
                                                                                if (err3) throw err3;
                                                                                var currextraatk = parseInt(rows3[0].extraatk);
                                                                                var currextrahp = parseInt(rows3[0].extrahp);
                                                                                extrastatsql = "UPDATE fightstat SET extraatk = "+(currextraatk+extraaofitem)+", extrahp = "+(currextrahp+extrahofitem)+" WHERE name = '"+message.author.id+"'";
                                                                                con.query(extrastatsql);
                                                                                message.reply("**"+itemname+" **is equipped as **Ring 6**.");
                                                                                if (quantityown==1){
                                                                                    deletesql = "DELETE FROM storage WHERE user = '"+message.author.id+"' AND item ="+args[2];
                                                                                    con.query(deletesql);
                                                                                }
                                                                                else{
                                                                                    deletesql = "UPDATE storage SET quantity ="+(quantityown-1)+" WHERE item = "+args[2]+" AND user ='"+message.author.id+"'";
                                                                                    con.query(deletesql);
                                                                                }
                                                                            })
                                                                        }
                                                                        else if (rows2[0].ring7 == null){
                                                                            equipsql = "UPDATE gear SET ring7 = '"+itemname+"' WHERE user = '"+guy+"'";
                                                                            con.query(equipsql);
                                                                            con.query("SELECT * FROM fightstat WHERE name = '"+message.author.id+"'",(err3,rows3)=>{
                                                                                if (err3) throw err3;
                                                                                var currextraatk = parseInt(rows3[0].extraatk);
                                                                                var currextrahp = parseInt(rows3[0].extrahp);
                                                                                extrastatsql = "UPDATE fightstat SET extraatk = "+(currextraatk+extraaofitem)+", extrahp = "+(currextrahp+extrahofitem)+" WHERE name = '"+message.author.id+"'";
                                                                                con.query(extrastatsql);
                                                                                message.reply("**"+itemname+" **is equipped as **Ring 7**.");
                                                                                if (quantityown==1){
                                                                                    deletesql = "DELETE FROM storage WHERE user = '"+message.author.id+"' AND item ="+args[2];
                                                                                    con.query(deletesql);
                                                                                }
                                                                                else{
                                                                                    deletesql = "UPDATE storage SET quantity ="+(quantityown-1)+" WHERE item = "+args[2]+" AND user ='"+message.author.id+"'";
                                                                                    con.query(deletesql);
                                                                                }
                                                                            })
                                                                        }
                                                                        else if (rows2[0].ring8 == null){
                                                                            equipsql = "UPDATE gear SET ring8 = '"+itemname+"' WHERE user = '"+guy+"'";
                                                                            con.query(equipsql);
                                                                            con.query("SELECT * FROM fightstat WHERE name = '"+message.author.id+"'",(err3,rows3)=>{
                                                                                if (err3) throw err3;
                                                                                var currextraatk = parseInt(rows3[0].extraatk);
                                                                                var currextrahp = parseInt(rows3[0].extrahp);
                                                                                extrastatsql = "UPDATE fightstat SET extraatk = "+(currextraatk+extraaofitem)+", extrahp = "+(currextrahp+extrahofitem)+" WHERE name = '"+message.author.id+"'";
                                                                                con.query(extrastatsql);
                                                                                message.reply("**"+itemname+" **is equipped as **Ring 8**.");
                                                                                if (quantityown==1){
                                                                                    deletesql = "DELETE FROM storage WHERE user = '"+message.author.id+"' AND item ="+args[2];
                                                                                    con.query(deletesql);
                                                                                }
                                                                                else{
                                                                                    deletesql = "UPDATE storage SET quantity ="+(quantityown-1)+" WHERE item = "+args[2]+" AND user ='"+message.author.id+"'";
                                                                                    con.query(deletesql);
                                                                                }
                                                                            })
                                                                        }
                                                                        else if (rows2[0].ring9 == null){
                                                                            equipsql = "UPDATE gear SET ring9 = '"+itemname+"' WHERE user = '"+guy+"'";
                                                                            con.query(equipsql);
                                                                            con.query("SELECT * FROM fightstat WHERE name = '"+message.author.id+"'",(err3,rows3)=>{
                                                                                if (err3) throw err3;
                                                                                var currextraatk = parseInt(rows3[0].extraatk);
                                                                                var currextrahp = parseInt(rows3[0].extrahp);
                                                                                extrastatsql = "UPDATE fightstat SET extraatk = "+(currextraatk+extraaofitem)+", extrahp = "+(currextrahp+extrahofitem)+" WHERE name = '"+message.author.id+"'";
                                                                                con.query(extrastatsql);
                                                                                message.reply("**"+itemname+" **is equipped as **Ring 9**.");
                                                                                if (quantityown==1){
                                                                                    deletesql = "DELETE FROM storage WHERE user = '"+message.author.id+"' AND item ="+args[2];
                                                                                    con.query(deletesql);
                                                                                }
                                                                                else{
                                                                                    deletesql = "UPDATE storage SET quantity ="+(quantityown-1)+" WHERE item = "+args[2]+" AND user ='"+message.author.id+"'";
                                                                                    con.query(deletesql);
                                                                                }
                                                                            })
                                                                        }
                                                                        else if (rows2[0].ring10 == null){
                                                                            equipsql = "UPDATE gear SET ring10 = '"+itemname+"' WHERE user = '"+guy+"'";
                                                                            con.query(equipsql);
                                                                            con.query("SELECT * FROM fightstat WHERE name = '"+message.author.id+"'",(err3,rows3)=>{
                                                                                if (err3) throw err3;
                                                                                var currextraatk = parseInt(rows3[0].extraatk);
                                                                                var currextrahp = parseInt(rows3[0].extrahp);
                                                                                extrastatsql = "UPDATE fightstat SET extraatk = "+(currextraatk+extraaofitem)+", extrahp = "+(currextrahp+extrahofitem)+" WHERE name = '"+message.author.id+"'";
                                                                                con.query(extrastatsql);
                                                                                message.reply("**"+itemname+" **is equipped as **Ring 10**.");
                                                                                if (quantityown==1){
                                                                                    deletesql = "DELETE FROM storage WHERE user = '"+message.author.id+"' AND item ="+args[2];
                                                                                    con.query(deletesql);
                                                                                }
                                                                                else{
                                                                                    deletesql = "UPDATE storage SET quantity ="+(quantityown-1)+" WHERE item = "+args[2]+" AND user ='"+message.author.id+"'";
                                                                                    con.query(deletesql);
                                                                                }
                                                                            })
                                                                        }
                                                                        else{
                                                                            message.reply("Enter the ring number to be replaced.");
                                                                            console.log("quantityown: "+quantityown);
                                                                            var notanswered1 = true;
                                                                            bot.on('message', async message => {
                                                                                if (message.author.id==guy){
                                                                                    try{
                                                                                        if (message.content.toLowerCase() === '1' && notanswered1) {
                                                                                            notanswered1 = false;
                                                                                            con.query("SELECT * FROM gear WHERE user = '"+message.author.id+"'",(err4,rows4)=>{
                                                                                                if (err4) throw err4;
                                                                                                var itemtobereplaced = rows4[0].ring1;
                                                                                                con.query("SELECT * FROM item WHERE name = '"+itemtobereplaced+"'",(err5,rows5)=>{
                                                                                                    var oldatk = parseInt(rows5[0].extraatk);
                                                                                                    var oldhp = parseInt(rows5[0].extrahp);
                                                                                                    message.reply("Replace **"+itemtobereplaced+"** with **"+itemname+"**? (yes/no)");
                                                                                                    var notanswered2 = true;
                                                                                                    bot.on('message', async message => {
                                                                                                        if (message.author.id==guy){
                                                                                                            try{
                                                                                                                if (message.content.toLowerCase()=='yes'&& notanswered2){
                                                                                                                    notanswered2 = false;
                                                                                                                    message.reply("Replaced **"+itemtobereplaced+"** with **"+itemname+"**.");
                                                                                                                    con.query("SELECT * FROM fightstat WHERE name = '"+message.author.id+"'",(err3,rows3)=>{
                                                                                                                        if (err3) throw err3;
                                                                                                                        var currextraatk = parseInt(rows3[0].extraatk);
                                                                                                                        var currextrahp = parseInt(rows3[0].extrahp);
                                                                                                                        var updateringsql = "UPDATE gear SET ring1 = '"+itemname+"' WHERE user = '"+message.author.id+"'";
                                                                                                                        extrastatsql = "UPDATE fightstat SET extraatk = "+(currextraatk+extraaofitem-oldatk)+", extrahp = "+(currextrahp+extrahofitem-oldhp)+" WHERE name = '"+message.author.id+"'";
                                                                                                                        con.query(extrastatsql);
                                                                                                                        con.query(updateringsql);
                                                                                                                        if (quantityown==1){
                                                                                                                            var delsql = "DELETE FROM storage WHERE user = '"+message.author.id+"' AND item = "+args[2];
                                                                                                                            con.query(delsql);
                                                                                                                        }
                                                                                                                        else{
                                                                                                                            var delsql = "UPDATE storage SET quantity ="+(quantityown-1)+" WHERE item = "+args[2]+" AND user ='"+message.author.id+"'";
                                                                                                                            con.query(delsql);
                                                                                                                        }
                                                                                                                    })
                                                                                                                }
                                                                                                                else if (message.content.toLowerCase()=='no'&& notanswered2){
                                                                                                                    message.reply("**"+itemname+"** not equipped and **"+itemtobereplaced+"** not replaced.");
                                                                                                                    notanswered2 = false;
                                                                                                                }
                                                                                                                else{
                                                                                                                    notanswered2 = false;
                                                                                                                }
                                                                                                            }
                                                                                                            catch{
                                                                                                                message.reply("Error occured.");
                                                                                                            }
                                                                                                            
                                                                                                        }
                                                                                                    })
                                                                                                })
                                                                                            })
                                                                                        }
                                                                                        else if (message.content.toLowerCase() === '2' && notanswered1) {
                                                                                            notanswered1 = false;
                                                                                            con.query("SELECT * FROM gear WHERE user = '"+message.author.id+"'",(err4,rows4)=>{
                                                                                                if (err4) throw err4;
                                                                                                var itemtobereplaced = rows4[0].ring2;
                                                                                                con.query("SELECT * FROM item WHERE name = '"+itemtobereplaced+"'",(err5,rows5)=>{
                                                                                                    var oldatk = parseInt(rows5[0].extraatk);
                                                                                                    var oldhp = parseInt(rows5[0].extrahp);
                                                                                                    message.reply("Replace **"+itemtobereplaced+"** with **"+itemname+"**? (yes/no)");
                                                                                                    var notanswered2 = true;
                                                                                                    bot.on('message', async message => {
                                                                                                        if (message.author.id==guy){
                                                                                                            try{
                                                                                                                if (message.content.toLowerCase()=='yes'&& notanswered2){
                                                                                                                    notanswered2 = false;
                                                                                                                    message.reply("Replaced **"+itemtobereplaced+"** with **"+itemname+"**.");
                                                                                                                    con.query("SELECT * FROM fightstat WHERE name = '"+message.author.id+"'",(err3,rows3)=>{
                                                                                                                        if (err3) throw err3;
                                                                                                                        var currextraatk = parseInt(rows3[0].extraatk);
                                                                                                                        var currextrahp = parseInt(rows3[0].extrahp);
                                                                                                                        var updateringsql = "UPDATE gear SET ring2 = '"+itemname+"' WHERE user = '"+message.author.id+"'";
                                                                                                                        extrastatsql = "UPDATE fightstat SET extraatk = "+(currextraatk+extraaofitem-oldatk)+", extrahp = "+(currextrahp+extrahofitem-oldhp)+" WHERE name = '"+message.author.id+"'";
                                                                                                                        con.query(extrastatsql);
                                                                                                                        con.query(updateringsql);
                                                                                                                        if (quantityown==1){
                                                                                                                            var delsql = "DELETE FROM storage WHERE user = '"+message.author.id+"' AND item = "+args[2];
                                                                                                                            con.query(delsql);
                                                                                                                        }
                                                                                                                        else{
                                                                                                                            var delsql = "UPDATE storage SET quantity ="+(quantityown-1)+" WHERE item = "+args[2]+" AND user ='"+message.author.id+"'";
                                                                                                                            con.query(delsql);
                                                                                                                        }
                                                                                                                    })
                                                                                                                }
                                                                                                                else if (message.content.toLowerCase()=='no'&& notanswered2){
                                                                                                                    message.reply("**"+itemname+"** not equipped and **"+itemtobereplaced+"** not replaced.");
                                                                                                                    notanswered2 = false;
                                                                                                                }
                                                                                                                else{
                                                                                                                    notanswered2 = false;
                                                                                                                }
                                                                                                            }
                                                                                                            catch{
                                                                                                                message.reply("Error occured.");
                                                                                                            }
                                                                                                            
                                                                                                        }
                                                                                                    })
                                                                                                })
                                                                                            })
                                                                                        }
                                                                                        else if (message.content.toLowerCase() === '3' && notanswered1) {
                                                                                            notanswered1 = false;
                                                                                            con.query("SELECT * FROM gear WHERE user = '"+message.author.id+"'",(err4,rows4)=>{
                                                                                                if (err4) throw err4;
                                                                                                var itemtobereplaced = rows4[0].ring3;
                                                                                                con.query("SELECT * FROM item WHERE name = '"+itemtobereplaced+"'",(err5,rows5)=>{
                                                                                                    var oldatk = parseInt(rows5[0].extraatk);
                                                                                                    var oldhp = parseInt(rows5[0].extrahp);
                                                                                                    message.reply("Replace **"+itemtobereplaced+"** with **"+itemname+"**? (yes/no)");
                                                                                                    var notanswered2 = true;
                                                                                                    bot.on('message', async message => {
                                                                                                        if (message.author.id==guy){
                                                                                                            try{
                                                                                                                if (message.content.toLowerCase()=='yes'&& notanswered2){
                                                                                                                    notanswered2 = false;
                                                                                                                    message.reply("Replaced **"+itemtobereplaced+"** with **"+itemname+"**.");
                                                                                                                    con.query("SELECT * FROM fightstat WHERE name = '"+message.author.id+"'",(err3,rows3)=>{
                                                                                                                        if (err3) throw err3;
                                                                                                                        var currextraatk = parseInt(rows3[0].extraatk);
                                                                                                                        var currextrahp = parseInt(rows3[0].extrahp);
                                                                                                                        var updateringsql = "UPDATE gear SET ring3 = '"+itemname+"' WHERE user = '"+message.author.id+"'";
                                                                                                                        extrastatsql = "UPDATE fightstat SET extraatk = "+(currextraatk+extraaofitem-oldatk)+", extrahp = "+(currextrahp+extrahofitem-oldhp)+" WHERE name = '"+message.author.id+"'";
                                                                                                                        con.query(extrastatsql);
                                                                                                                        con.query(updateringsql);
                                                                                                                        if (quantityown==1){
                                                                                                                            var delsql = "DELETE FROM storage WHERE user = '"+message.author.id+"' AND item = "+args[2];
                                                                                                                            con.query(delsql);
                                                                                                                        }
                                                                                                                        else{
                                                                                                                            var delsql = "UPDATE storage SET quantity ="+(quantityown-1)+" WHERE item = "+args[2]+" AND user ='"+message.author.id+"'";
                                                                                                                            con.query(delsql);
                                                                                                                        }
                                                                                                                    })
                                                                                                                }
                                                                                                                else if (message.content.toLowerCase()=='no'&& notanswered2){
                                                                                                                    message.reply("**"+itemname+"** not equipped and **"+itemtobereplaced+"** not replaced.");
                                                                                                                    notanswered2 = false;
                                                                                                                }
                                                                                                                else{
                                                                                                                    notanswered2 = false;
                                                                                                                }
                                                                                                            }
                                                                                                            catch{
                                                                                                                message.reply("Error occured.");
                                                                                                            }
                                                                                                            
                                                                                                        }
                                                                                                    })
                                                                                                })
                                                                                            })
                                                                                        }
                                                                                        else if (message.content.toLowerCase() === '4' && notanswered1) {
                                                                                            notanswered1 = false;
                                                                                            con.query("SELECT * FROM gear WHERE user = '"+message.author.id+"'",(err4,rows4)=>{
                                                                                                if (err4) throw err4;
                                                                                                var itemtobereplaced = rows4[0].ring4;
                                                                                                con.query("SELECT * FROM item WHERE name = '"+itemtobereplaced+"'",(err5,rows5)=>{
                                                                                                    var oldatk = parseInt(rows5[0].extraatk);
                                                                                                    var oldhp = parseInt(rows5[0].extrahp);
                                                                                                    message.reply("Replace **"+itemtobereplaced+"** with **"+itemname+"**? (yes/no)");
                                                                                                    var notanswered2 = true;
                                                                                                    bot.on('message', async message => {
                                                                                                        if (message.author.id==guy){
                                                                                                            try{
                                                                                                                if (message.content.toLowerCase()=='yes'&& notanswered2){
                                                                                                                    notanswered2 = false;
                                                                                                                    message.reply("Replaced **"+itemtobereplaced+"** with **"+itemname+"**.");
                                                                                                                    con.query("SELECT * FROM fightstat WHERE name = '"+message.author.id+"'",(err3,rows3)=>{
                                                                                                                        if (err3) throw err3;
                                                                                                                        var currextraatk = parseInt(rows3[0].extraatk);
                                                                                                                        var currextrahp = parseInt(rows3[0].extrahp);
                                                                                                                        var updateringsql = "UPDATE gear SET ring4 = '"+itemname+"' WHERE user = '"+message.author.id+"'";
                                                                                                                        extrastatsql = "UPDATE fightstat SET extraatk = "+(currextraatk+extraaofitem-oldatk)+", extrahp = "+(currextrahp+extrahofitem-oldhp)+" WHERE name = '"+message.author.id+"'";
                                                                                                                        con.query(extrastatsql);
                                                                                                                        con.query(updateringsql);
                                                                                                                        if (quantityown==1){
                                                                                                                            var delsql = "DELETE FROM storage WHERE user = '"+message.author.id+"' AND item = "+args[2];
                                                                                                                            con.query(delsql);
                                                                                                                        }
                                                                                                                        else{
                                                                                                                            var delsql = "UPDATE storage SET quantity ="+(quantityown-1)+" WHERE item = "+args[2]+" AND user ='"+message.author.id+"'";
                                                                                                                            con.query(delsql);
                                                                                                                        }
                                                                                                                    })
                                                                                                                }
                                                                                                                else if (message.content.toLowerCase()=='no'&& notanswered2){
                                                                                                                    message.reply("**"+itemname+"** not equipped and **"+itemtobereplaced+"** not replaced.");
                                                                                                                    notanswered2 = false;
                                                                                                                }
                                                                                                                else{
                                                                                                                    notanswered2 = false;
                                                                                                                }
                                                                                                            }
                                                                                                            catch{
                                                                                                                message.reply("Error occured.");
                                                                                                            }
                                                                                                            
                                                                                                        }
                                                                                                    })
                                                                                                })
                                                                                            })
                                                                                        }
                                                                                        else if (message.content.toLowerCase() === '5' && notanswered1) {
                                                                                            notanswered1 = false;
                                                                                            con.query("SELECT * FROM gear WHERE user = '"+message.author.id+"'",(err4,rows4)=>{
                                                                                                if (err4) throw err4;
                                                                                                var itemtobereplaced = rows4[0].ring5;
                                                                                                con.query("SELECT * FROM item WHERE name = '"+itemtobereplaced+"'",(err5,rows5)=>{
                                                                                                    var oldatk = parseInt(rows5[0].extraatk);
                                                                                                    var oldhp = parseInt(rows5[0].extrahp);
                                                                                                    message.reply("Replace **"+itemtobereplaced+"** with **"+itemname+"**? (yes/no)");
                                                                                                    var notanswered2 = true;
                                                                                                    bot.on('message', async message => {
                                                                                                        if (message.author.id==guy){
                                                                                                            try{
                                                                                                                if (message.content.toLowerCase()=='yes'&& notanswered2){
                                                                                                                    notanswered2 = false;
                                                                                                                    message.reply("Replaced **"+itemtobereplaced+"** with **"+itemname+"**.");
                                                                                                                    con.query("SELECT * FROM fightstat WHERE name = '"+message.author.id+"'",(err3,rows3)=>{
                                                                                                                        if (err3) throw err3;
                                                                                                                        var currextraatk = parseInt(rows3[0].extraatk);
                                                                                                                        var currextrahp = parseInt(rows3[0].extrahp);
                                                                                                                        var updateringsql = "UPDATE gear SET ring5 = '"+itemname+"' WHERE user = '"+message.author.id+"'";
                                                                                                                        extrastatsql = "UPDATE fightstat SET extraatk = "+(currextraatk+extraaofitem-oldatk)+", extrahp = "+(currextrahp+extrahofitem-oldhp)+" WHERE name = '"+message.author.id+"'";
                                                                                                                        con.query(extrastatsql);
                                                                                                                        con.query(updateringsql);
                                                                                                                        if (quantityown==1){
                                                                                                                            var delsql = "DELETE FROM storage WHERE user = '"+message.author.id+"' AND item = "+args[2];
                                                                                                                            con.query(delsql);
                                                                                                                        }
                                                                                                                        else{
                                                                                                                            var delsql = "UPDATE storage SET quantity ="+(quantityown-1)+" WHERE item = "+args[2]+" AND user ='"+message.author.id+"'";
                                                                                                                            con.query(delsql);
                                                                                                                        }
                                                                                                                    })
                                                                                                                }
                                                                                                                else if (message.content.toLowerCase()=='no'&& notanswered2){
                                                                                                                    message.reply("**"+itemname+"** not equipped and **"+itemtobereplaced+"** not replaced.");
                                                                                                                    notanswered2 = false;
                                                                                                                }
                                                                                                                else{
                                                                                                                    notanswered2 = false;
                                                                                                                }
                                                                                                            }
                                                                                                            catch{
                                                                                                                message.reply("Error occured.");
                                                                                                            }
                                                                                                            
                                                                                                        }
                                                                                                    })
                                                                                                })
                                                                                            })
                                                                                        }
                                                                                        else if (message.content.toLowerCase() === '6' && notanswered1) {
                                                                                            notanswered1 = false;
                                                                                            con.query("SELECT * FROM gear WHERE user = '"+message.author.id+"'",(err4,rows4)=>{
                                                                                                if (err4) throw err4;
                                                                                                var itemtobereplaced = rows4[0].ring6;
                                                                                                con.query("SELECT * FROM item WHERE name = '"+itemtobereplaced+"'",(err5,rows5)=>{
                                                                                                    var oldatk = parseInt(rows5[0].extraatk);
                                                                                                    var oldhp = parseInt(rows5[0].extrahp);
                                                                                                    message.reply("Replace **"+itemtobereplaced+"** with **"+itemname+"**? (yes/no)");
                                                                                                    var notanswered2 = true;
                                                                                                    bot.on('message', async message => {
                                                                                                        if (message.author.id==guy){
                                                                                                            try{
                                                                                                                if (message.content.toLowerCase()=='yes'&& notanswered2){
                                                                                                                    notanswered2 = false;
                                                                                                                    message.reply("Replaced **"+itemtobereplaced+"** with **"+itemname+"**.");
                                                                                                                    con.query("SELECT * FROM fightstat WHERE name = '"+message.author.id+"'",(err3,rows3)=>{
                                                                                                                        if (err3) throw err3;
                                                                                                                        var currextraatk = parseInt(rows3[0].extraatk);
                                                                                                                        var currextrahp = parseInt(rows3[0].extrahp);
                                                                                                                        var updateringsql = "UPDATE gear SET ring6 = '"+itemname+"' WHERE user = '"+message.author.id+"'";
                                                                                                                        extrastatsql = "UPDATE fightstat SET extraatk = "+(currextraatk+extraaofitem-oldatk)+", extrahp = "+(currextrahp+extrahofitem-oldhp)+" WHERE name = '"+message.author.id+"'";
                                                                                                                        con.query(extrastatsql);
                                                                                                                        con.query(updateringsql);
                                                                                                                        if (quantityown==1){
                                                                                                                            var delsql = "DELETE FROM storage WHERE user = '"+message.author.id+"' AND item = "+args[2];
                                                                                                                            con.query(delsql);
                                                                                                                        }
                                                                                                                        else{
                                                                                                                            var delsql = "UPDATE storage SET quantity ="+(quantityown-1)+" WHERE item = "+args[2]+" AND user ='"+message.author.id+"'";
                                                                                                                            con.query(delsql);
                                                                                                                        }
                                                                                                                    })
                                                                                                                }
                                                                                                                else if (message.content.toLowerCase()=='no'&& notanswered2){
                                                                                                                    message.reply("**"+itemname+"** not equipped and **"+itemtobereplaced+"** not replaced.");
                                                                                                                    notanswered2 = false;
                                                                                                                }
                                                                                                                else{
                                                                                                                    notanswered2 = false;
                                                                                                                }
                                                                                                            }
                                                                                                            catch{
                                                                                                                message.reply("Error occured.");
                                                                                                            }
                                                                                                            
                                                                                                        }
                                                                                                    })
                                                                                                })
                                                                                            })
                                                                                        }
                                                                                        else if (message.content.toLowerCase() === '7' && notanswered1) {
                                                                                            notanswered1 = false;
                                                                                            con.query("SELECT * FROM gear WHERE user = '"+message.author.id+"'",(err4,rows4)=>{
                                                                                                if (err4) throw err4;
                                                                                                var itemtobereplaced = rows4[0].ring7;
                                                                                                con.query("SELECT * FROM item WHERE name = '"+itemtobereplaced+"'",(err5,rows5)=>{
                                                                                                    var oldatk = parseInt(rows5[0].extraatk);
                                                                                                    var oldhp = parseInt(rows5[0].extrahp);
                                                                                                    message.reply("Replace **"+itemtobereplaced+"** with **"+itemname+"**? (yes/no)");
                                                                                                    var notanswered2 = true;
                                                                                                    bot.on('message', async message => {
                                                                                                        if (message.author.id==guy){
                                                                                                            try{
                                                                                                                if (message.content.toLowerCase()=='yes'&& notanswered2){
                                                                                                                    notanswered2 = false;
                                                                                                                    message.reply("Replaced **"+itemtobereplaced+"** with **"+itemname+"**.");
                                                                                                                    con.query("SELECT * FROM fightstat WHERE name = '"+message.author.id+"'",(err3,rows3)=>{
                                                                                                                        if (err3) throw err3;
                                                                                                                        var currextraatk = parseInt(rows3[0].extraatk);
                                                                                                                        var currextrahp = parseInt(rows3[0].extrahp);
                                                                                                                        var updateringsql = "UPDATE gear SET ring7 = '"+itemname+"' WHERE user = '"+message.author.id+"'";
                                                                                                                        extrastatsql = "UPDATE fightstat SET extraatk = "+(currextraatk+extraaofitem-oldatk)+", extrahp = "+(currextrahp+extrahofitem-oldhp)+" WHERE name = '"+message.author.id+"'";
                                                                                                                        con.query(extrastatsql);
                                                                                                                        con.query(updateringsql);
                                                                                                                        if (quantityown==1){
                                                                                                                            var delsql = "DELETE FROM storage WHERE user = '"+message.author.id+"' AND item = "+args[2];
                                                                                                                            con.query(delsql);
                                                                                                                        }
                                                                                                                        else{
                                                                                                                            var delsql = "UPDATE storage SET quantity ="+(quantityown-1)+" WHERE item = "+args[2]+" AND user ='"+message.author.id+"'";
                                                                                                                            con.query(delsql);
                                                                                                                        }
                                                                                                                    })
                                                                                                                }
                                                                                                                else if (message.content.toLowerCase()=='no'&& notanswered2){
                                                                                                                    message.reply("**"+itemname+"** not equipped and **"+itemtobereplaced+"** not replaced.");
                                                                                                                    notanswered2 = false;
                                                                                                                }
                                                                                                                else{
                                                                                                                    notanswered2 = false;
                                                                                                                }
                                                                                                            }
                                                                                                            catch{
                                                                                                                message.reply("Error occured.");
                                                                                                            }
                                                                                                            
                                                                                                        }
                                                                                                    })
                                                                                                })
                                                                                            })
                                                                                        }
                                                                                        else if (message.content.toLowerCase() === '8' && notanswered1) {
                                                                                            notanswered1 = false;
                                                                                            con.query("SELECT * FROM gear WHERE user = '"+message.author.id+"'",(err4,rows4)=>{
                                                                                                if (err4) throw err4;
                                                                                                var itemtobereplaced = rows4[0].ring8;
                                                                                                con.query("SELECT * FROM item WHERE name = '"+itemtobereplaced+"'",(err5,rows5)=>{
                                                                                                    var oldatk = parseInt(rows5[0].extraatk);
                                                                                                    var oldhp = parseInt(rows5[0].extrahp);
                                                                                                    message.reply("Replace **"+itemtobereplaced+"** with **"+itemname+"**? (yes/no)");
                                                                                                    var notanswered2 = true;
                                                                                                    bot.on('message', async message => {
                                                                                                        if (message.author.id==guy){
                                                                                                            try{
                                                                                                                if (message.content.toLowerCase()=='yes'&& notanswered2){
                                                                                                                    notanswered2 = false;
                                                                                                                    message.reply("Replaced **"+itemtobereplaced+"** with **"+itemname+"**.");
                                                                                                                    con.query("SELECT * FROM fightstat WHERE name = '"+message.author.id+"'",(err3,rows3)=>{
                                                                                                                        if (err3) throw err3;
                                                                                                                        var currextraatk = parseInt(rows3[0].extraatk);
                                                                                                                        var currextrahp = parseInt(rows3[0].extrahp);
                                                                                                                        var updateringsql = "UPDATE gear SET ring8 = '"+itemname+"' WHERE user = '"+message.author.id+"'";
                                                                                                                        extrastatsql = "UPDATE fightstat SET extraatk = "+(currextraatk+extraaofitem-oldatk)+", extrahp = "+(currextrahp+extrahofitem-oldhp)+" WHERE name = '"+message.author.id+"'";
                                                                                                                        con.query(extrastatsql);
                                                                                                                        con.query(updateringsql);
                                                                                                                        if (quantityown==1){
                                                                                                                            var delsql = "DELETE FROM storage WHERE user = '"+message.author.id+"' AND item = "+args[2];
                                                                                                                            con.query(delsql);
                                                                                                                        }
                                                                                                                        else{
                                                                                                                            var delsql = "UPDATE storage SET quantity ="+(quantityown-1)+" WHERE item = "+args[2]+" AND user ='"+message.author.id+"'";
                                                                                                                            con.query(delsql);
                                                                                                                        }
                                                                                                                    })
                                                                                                                }
                                                                                                                else if (message.content.toLowerCase()=='no'&& notanswered2){
                                                                                                                    message.reply("**"+itemname+"** not equipped and **"+itemtobereplaced+"** not replaced.");
                                                                                                                    notanswered2 = false;
                                                                                                                }
                                                                                                                else{
                                                                                                                    notanswered2 = false;
                                                                                                                }
                                                                                                            }
                                                                                                            catch{
                                                                                                                message.reply("Error occured.");
                                                                                                            }
                                                                                                            
                                                                                                        }
                                                                                                    })
                                                                                                })
                                                                                            })
                                                                                        }
                                                                                        else if (message.content.toLowerCase() === '9' && notanswered1) {
                                                                                            notanswered1 = false;
                                                                                            con.query("SELECT * FROM gear WHERE user = '"+message.author.id+"'",(err4,rows4)=>{
                                                                                                if (err4) throw err4;
                                                                                                var itemtobereplaced = rows4[0].ring9;
                                                                                                con.query("SELECT * FROM item WHERE name = '"+itemtobereplaced+"'",(err5,rows5)=>{
                                                                                                    var oldatk = parseInt(rows5[0].extraatk);
                                                                                                    var oldhp = parseInt(rows5[0].extrahp);
                                                                                                    message.reply("Replace **"+itemtobereplaced+"** with **"+itemname+"**? (yes/no)");
                                                                                                    var notanswered2 = true;
                                                                                                    bot.on('message', async message => {
                                                                                                        if (message.author.id==guy){
                                                                                                            try{
                                                                                                                if (message.content.toLowerCase()=='yes'&& notanswered2){
                                                                                                                    notanswered2 = false;
                                                                                                                    message.reply("Replaced **"+itemtobereplaced+"** with **"+itemname+"**.");
                                                                                                                    con.query("SELECT * FROM fightstat WHERE name = '"+message.author.id+"'",(err3,rows3)=>{
                                                                                                                        if (err3) throw err3;
                                                                                                                        var currextraatk = parseInt(rows3[0].extraatk);
                                                                                                                        var currextrahp = parseInt(rows3[0].extrahp);
                                                                                                                        var updateringsql = "UPDATE gear SET ring9 = '"+itemname+"' WHERE user = '"+message.author.id+"'";
                                                                                                                        extrastatsql = "UPDATE fightstat SET extraatk = "+(currextraatk+extraaofitem-oldatk)+", extrahp = "+(currextrahp+extrahofitem-oldhp)+" WHERE name = '"+message.author.id+"'";
                                                                                                                        con.query(extrastatsql);
                                                                                                                        con.query(updateringsql);
                                                                                                                        if (quantityown==1){
                                                                                                                            var delsql = "DELETE FROM storage WHERE user = '"+message.author.id+"' AND item = "+args[2];
                                                                                                                            con.query(delsql);
                                                                                                                        }
                                                                                                                        else{
                                                                                                                            var delsql = "UPDATE storage SET quantity ="+(quantityown-1)+" WHERE item = "+args[2]+" AND user ='"+message.author.id+"'";
                                                                                                                            con.query(delsql);
                                                                                                                        }
                                                                                                                    })
                                                                                                                }
                                                                                                                else if (message.content.toLowerCase()=='no'&& notanswered2){
                                                                                                                    message.reply("**"+itemname+"** not equipped and **"+itemtobereplaced+"** not replaced.");
                                                                                                                    notanswered2 = false;
                                                                                                                }
                                                                                                                else{
                                                                                                                    notanswered2 = false;
                                                                                                                }
                                                                                                            }
                                                                                                            catch{
                                                                                                                message.reply("Error occured.");
                                                                                                            }
                                                                                                            
                                                                                                        }
                                                                                                    })
                                                                                                })
                                                                                            })
                                                                                        }
                                                                                        else if (message.content.toLowerCase() === '10' && notanswered1) {
                                                                                            notanswered1 = false;
                                                                                            con.query("SELECT * FROM gear WHERE user = '"+message.author.id+"'",(err4,rows4)=>{
                                                                                                if (err4) throw err4;
                                                                                                var itemtobereplaced = rows4[0].ring10;
                                                                                                con.query("SELECT * FROM item WHERE name = '"+itemtobereplaced+"'",(err5,rows5)=>{
                                                                                                    var oldatk = parseInt(rows5[0].extraatk);
                                                                                                    var oldhp = parseInt(rows5[0].extrahp);
                                                                                                    message.reply("Replace **"+itemtobereplaced+"** with **"+itemname+"**? (yes/no)");
                                                                                                    var notanswered2 = true;
                                                                                                    bot.on('message', async message => {
                                                                                                        if (message.author.id==guy){
                                                                                                            try{
                                                                                                                if (message.content.toLowerCase()=='yes'&& notanswered2){
                                                                                                                    notanswered2 = false;
                                                                                                                    message.reply("Replaced **"+itemtobereplaced+"** with **"+itemname+"**.");
                                                                                                                    con.query("SELECT * FROM fightstat WHERE name = '"+message.author.id+"'",(err3,rows3)=>{
                                                                                                                        if (err3) throw err3;
                                                                                                                        var currextraatk = parseInt(rows3[0].extraatk);
                                                                                                                        var currextrahp = parseInt(rows3[0].extrahp);
                                                                                                                        var updateringsql = "UPDATE gear SET ring10 = '"+itemname+"' WHERE user = '"+message.author.id+"'";
                                                                                                                        extrastatsql = "UPDATE fightstat SET extraatk = "+(currextraatk+extraaofitem-oldatk)+", extrahp = "+(currextrahp+extrahofitem-oldhp)+" WHERE name = '"+message.author.id+"'";
                                                                                                                        con.query(extrastatsql);
                                                                                                                        con.query(updateringsql);
                                                                                                                        if (quantityown==1){
                                                                                                                            var delsql = "DELETE FROM storage WHERE user = '"+message.author.id+"' AND item = "+args[2];
                                                                                                                            con.query(delsql);
                                                                                                                        }
                                                                                                                        else{
                                                                                                                            var delsql = "UPDATE storage SET quantity ="+(quantityown-1)+" WHERE item = "+args[2]+" AND user ='"+message.author.id+"'";
                                                                                                                            con.query(delsql);
                                                                                                                        }
                                                                                                                    })
                                                                                                                }
                                                                                                                else if (message.content.toLowerCase()=='no'&& notanswered2){
                                                                                                                    message.reply("**"+itemname+"** not equipped and **"+itemtobereplaced+"** not replaced.");
                                                                                                                    notanswered2 = false;
                                                                                                                }
                                                                                                                else{
                                                                                                                    notanswered2 = false;
                                                                                                                }
                                                                                                            }
                                                                                                            catch{
                                                                                                                message.reply("Error occured.");
                                                                                                            }
                                                                                                            
                                                                                                        }
                                                                                                    })
                                                                                                })
                                                                                            })
                                                                                        }
                                                                                        else{
                                                                                            notanswered1 = false;
                                                                                        }
                                                                                    }
                                                                                    catch{
                                                                                        message.reply(message.content);
                                                                                    }
                                                                                }
                                                                            });
                                                                        }
                                                                    }
                                                                })
                                                            }
                                                            else if (itemtype == "mask" || itemtype == "mask(hidden)"){
                                                                con.query("SELECT * FROM gear WHERE user = '"+message.author.id+"'",(err2,rows2)=>{
                                                                    if (rows2.lenght<1){
                                                                        message.reply("Please select a role before trying to equip an item.");
                                                                    }
                                                                    else{
                                                                        if (rows2[0].mask == null){
                                                                            equipsql = "UPDATE gear SET mask = '"+itemname+"' WHERE user = '"+guy+"'";
                                                                            con.query(equipsql);
                                                                            con.query("SELECT * FROM fightstat WHERE name = '"+message.author.id+"'",(err3,rows3)=>{
                                                                                if (err3) throw err3;
                                                                                var currextraatk = parseInt(rows3[0].extraatk);
                                                                                var currextrahp = parseInt(rows3[0].extrahp);
                                                                                extrastatsql = "UPDATE fightstat SET extraatk = "+(currextraatk+extraaofitem)+", extrahp = "+(currextrahp+extrahofitem)+" WHERE name = '"+message.author.id+"'";
                                                                                con.query(extrastatsql);
                                                                                message.reply("**"+itemname+" **is equipped as **Mask**.");
                                                                                if (quantityown==1){
                                                                                    deletesql = "DELETE FROM storage WHERE user = '"+message.author.id+"' AND item ="+args[2];
                                                                                    con.query(deletesql);
                                                                                }
                                                                                else{
                                                                                    deletesql = "UPDATE storage SET quantity ="+(quantityown-1)+" WHERE item = "+args[2]+" AND user ='"+message.author.id+"'";
                                                                                    con.query(deletesql);
                                                                                }
                                                                            })
                                                                        }
                                                                        else{
                                                                            message.reply("Are you sure you want to replace **"+rows2[0].mask+"** with **"+itemname+"**? (yes/no)");
                                                                            var notanswered1 = true;
                                                                            bot.on('message', async message => {
                                                                                if (message.author.id==guy){
                                                                                    try{
                                                                                        if (message.content.toLowerCase()=='yes' && notanswered1){
                                                                                            con.query("SELECT * FROM item WHERE name = '"+rows2[0].mask+"'",(err5,rows5)=>{
                                                                                                var oldatk = parseInt(rows5[0].extraatk);
                                                                                                var oldhp = parseInt(rows5[0].extrahp);
                                                                                                
                                                                                                message.reply("Replaced **"+rows2[0].mask+"** with **"+itemname+"**.");
                                                                                                con.query("SELECT * FROM fightstat WHERE name = '"+message.author.id+"'",(err3,rows3)=>{
                                                                                                    if (err3) throw err3;
                                                                                                    var currextraatk = parseInt(rows3[0].extraatk);
                                                                                                    var currextrahp = parseInt(rows3[0].extrahp);
                                                                                                    var updateringsql = "UPDATE gear SET ring10 = '"+itemname+"' WHERE user = '"+message.author.id+"'";
                                                                                                    extrastatsql = "UPDATE fightstat SET extraatk = "+(currextraatk+extraaofitem-oldatk)+", extrahp = "+(currextrahp+extrahofitem-oldhp)+" WHERE name = '"+message.author.id+"'";
                                                                                                    con.query(extrastatsql);
                                                                                                    con.query(updateringsql);
                                                                                                    if (quantityown==1){
                                                                                                        var delsql = "DELETE FROM storage WHERE user = '"+message.author.id+"' AND item = "+args[2];
                                                                                                        con.query(delsql);
                                                                                                    }
                                                                                                    else{
                                                                                                        var delsql = "UPDATE storage SET quantity ="+(quantityown-1)+" WHERE item = "+args[2]+" AND user ='"+message.author.id+"'";
                                                                                                        con.query(delsql);
                                                                                                    }
                                                                                                })
                                                                                            })
                                                                                                            
                                                                                        }
                                                                                        else{
                                                                                            message.reply("**"+rows2[0].mask+"** has not been replaced with **"+itemname+"**.");
                                                                                        }
                                                                                    }
                                                                                    catch{
                                                                                        message.reply("Error occured.");
                                                                                    }
                                                                                }
                                                                            })
                                                                        }
                                                                    }
                                                                })
                                                            }
                                                            else if (itemtype == "mainweapon" || itemtype == "mainweapon(hidden)"){
                                                                con.query("SELECT * FROM gear WHERE user = '"+message.author.id+"'",(err2,rows2)=>{
                                                                    if (rows2.lenght<1){
                                                                        message.reply("Please select a role before trying to equip an item.");
                                                                    }
                                                                    else{
                                                                        if (rows2[0].mainweapon == null){
                                                                            equipsql = "UPDATE gear SET mask = '"+itemname+"' WHERE user = '"+guy+"'";
                                                                            con.query(equipsql);
                                                                            con.query("SELECT * FROM fightstat WHERE name = '"+message.author.id+"'",(err3,rows3)=>{
                                                                                if (err3) throw err3;
                                                                                var currextraatk = parseInt(rows3[0].extraatk);
                                                                                var currextrahp = parseInt(rows3[0].extrahp);
                                                                                extrastatsql = "UPDATE fightstat SET extraatk = "+(currextraatk+extraaofitem)+", extrahp = "+(currextrahp+extrahofitem)+" WHERE name = '"+message.author.id+"'";
                                                                                con.query(extrastatsql);
                                                                                message.reply("**"+itemname+" **is equipped as **Main Weapon**.");
                                                                                if (quantityown==1){
                                                                                    deletesql = "DELETE FROM storage WHERE user = '"+message.author.id+"' AND item ="+args[2];
                                                                                    con.query(deletesql);
                                                                                }
                                                                                else{
                                                                                    deletesql = "UPDATE storage SET quantity ="+(quantityown-1)+" WHERE item = "+args[2]+" AND user ='"+message.author.id+"'";
                                                                                    con.query(deletesql);
                                                                                }
                                                                            })
                                                                        }
                                                                        else{
                                                                            message.reply("Are you sure you want to replace **"+rows2[0].mainweapon+"** with **"+itemname+"**? (yes/no)");
                                                                            var notanswered1 = true;
                                                                            bot.on('message', async message => {
                                                                                if (message.author.id==guy){
                                                                                    try{
                                                                                        if (message.content.toLowerCase()=='yes' && notanswered1){
                                                                                            con.query("SELECT * FROM item WHERE name = '"+rows2[0].mainweapon+"'",(err5,rows5)=>{
                                                                                                var oldatk = parseInt(rows5[0].extraatk);
                                                                                                var oldhp = parseInt(rows5[0].extrahp);
                                                                                                
                                                                                                message.reply("Replaced **"+rows2[0].mainweapon+"** with **"+itemname+"**.");
                                                                                                con.query("SELECT * FROM fightstat WHERE name = '"+message.author.id+"'",(err3,rows3)=>{
                                                                                                    if (err3) throw err3;
                                                                                                    var currextraatk = parseInt(rows3[0].extraatk);
                                                                                                    var currextrahp = parseInt(rows3[0].extrahp);
                                                                                                    var updateringsql = "UPDATE gear SET ring10 = '"+itemname+"' WHERE user = '"+message.author.id+"'";
                                                                                                    extrastatsql = "UPDATE fightstat SET extraatk = "+(currextraatk+extraaofitem-oldatk)+", extrahp = "+(currextrahp+extrahofitem-oldhp)+" WHERE name = '"+message.author.id+"'";
                                                                                                    con.query(extrastatsql);
                                                                                                    con.query(updateringsql);
                                                                                                    if (quantityown==1){
                                                                                                        var delsql = "DELETE FROM storage WHERE user = '"+message.author.id+"' AND item = "+args[2];
                                                                                                        con.query(delsql);
                                                                                                    }
                                                                                                    else{
                                                                                                        var delsql = "UPDATE storage SET quantity ="+(quantityown-1)+" WHERE item = "+args[2]+" AND user ='"+message.author.id+"'";
                                                                                                        con.query(delsql);
                                                                                                    }
                                                                                                })
                                                                                            })
                                                                                                            
                                                                                        }
                                                                                        else{
                                                                                            message.reply("**"+rows2[0].mainweapon+"** has not been replaced with **"+itemname+"**.");
                                                                                        }
                                                                                    }
                                                                                    catch{
                                                                                        message.reply("Error occured.");
                                                                                    }
                                                                                }
                                                                            })
                                                                        }
                                                                    }
                                                                })
                                                            }
                                                            else if (itemtype == "offweapon" || itemtype == "offweapon(hidden)"){
                                                                con.query("SELECT * FROM gear WHERE user = '"+message.author.id+"'",(err2,rows2)=>{
                                                                    if (rows2.lenght<1){
                                                                        message.reply("Please select a role before trying to equip an item.");
                                                                    }
                                                                    else{
                                                                        if (rows2[0].offweapon == null){
                                                                            equipsql = "UPDATE gear SET mask = '"+itemname+"' WHERE user = '"+guy+"'";
                                                                            con.query(equipsql);
                                                                            con.query("SELECT * FROM fightstat WHERE name = '"+message.author.id+"'",(err3,rows3)=>{
                                                                                if (err3) throw err3;
                                                                                var currextraatk = parseInt(rows3[0].extraatk);
                                                                                var currextrahp = parseInt(rows3[0].extrahp);
                                                                                extrastatsql = "UPDATE fightstat SET extraatk = "+(currextraatk+extraaofitem)+", extrahp = "+(currextrahp+extrahofitem)+" WHERE name = '"+message.author.id+"'";
                                                                                con.query(extrastatsql);
                                                                                message.reply("**"+itemname+" **is equipped as **Main Weapon**.");
                                                                                if (quantityown==1){
                                                                                    deletesql = "DELETE FROM storage WHERE user = '"+message.author.id+"' AND item ="+args[2];
                                                                                    con.query(deletesql);
                                                                                }
                                                                                else{
                                                                                    deletesql = "UPDATE storage SET quantity ="+(quantityown-1)+" WHERE item = "+args[2]+" AND user ='"+message.author.id+"'";
                                                                                    con.query(deletesql);
                                                                                }
                                                                            })
                                                                        }
                                                                        else{
                                                                            message.reply("Are you sure you want to replace **"+rows2[0].offweapon+"** with **"+itemname+"**? (yes/no)");
                                                                            var notanswered1 = true;
                                                                            bot.on('message', async message => {
                                                                                if (message.author.id==guy){
                                                                                    try{
                                                                                        if (message.content.toLowerCase()=='yes' && notanswered1){
                                                                                            con.query("SELECT * FROM item WHERE name = '"+rows2[0].offweapon+"'",(err5,rows5)=>{
                                                                                                var oldatk = parseInt(rows5[0].extraatk);
                                                                                                var oldhp = parseInt(rows5[0].extrahp);
                                                                                                
                                                                                                message.reply("Replaced **"+rows2[0].offweapon+"** with **"+itemname+"**.");
                                                                                                con.query("SELECT * FROM fightstat WHERE name = '"+message.author.id+"'",(err3,rows3)=>{
                                                                                                    if (err3) throw err3;
                                                                                                    var currextraatk = parseInt(rows3[0].extraatk);
                                                                                                    var currextrahp = parseInt(rows3[0].extrahp);
                                                                                                    var updateringsql = "UPDATE gear SET ring10 = '"+itemname+"' WHERE user = '"+message.author.id+"'";
                                                                                                    extrastatsql = "UPDATE fightstat SET extraatk = "+(currextraatk+extraaofitem-oldatk)+", extrahp = "+(currextrahp+extrahofitem-oldhp)+" WHERE name = '"+message.author.id+"'";
                                                                                                    con.query(extrastatsql);
                                                                                                    con.query(updateringsql);
                                                                                                    if (quantityown==1){
                                                                                                        var delsql = "DELETE FROM storage WHERE user = '"+message.author.id+"' AND item = "+args[2];
                                                                                                        con.query(delsql);
                                                                                                    }
                                                                                                    else{
                                                                                                        var delsql = "UPDATE storage SET quantity ="+(quantityown-1)+" WHERE item = "+args[2]+" AND user ='"+message.author.id+"'";
                                                                                                        con.query(delsql);
                                                                                                    }
                                                                                                })
                                                                                            })
                                                                                                            
                                                                                        }
                                                                                        else{
                                                                                            message.reply("**"+rows2[0].offweapon+"** has not been replaced with **"+itemname+"**.");
                                                                                        }
                                                                                    }
                                                                                    catch{
                                                                                        message.reply("Error occured.");
                                                                                    }
                                                                                }
                                                                            })
                                                                        }
                                                                    }
                                                                })
                                                            }
                                                            else if (itemtype == "necklace" || itemtype == "necklace(hidden)"){
                                                                con.query("SELECT * FROM gear WHERE user = '"+message.author.id+"'",(err2,rows2)=>{
                                                                    if (rows2.lenght<1){
                                                                        message.reply("Please select a role before trying to equip an item.");
                                                                    }
                                                                    else{
                                                                        if (rows2[0].necklace == null){
                                                                            equipsql = "UPDATE gear SET mask = '"+itemname+"' WHERE user = '"+guy+"'";
                                                                            con.query(equipsql);
                                                                            con.query("SELECT * FROM fightstat WHERE name = '"+message.author.id+"'",(err3,rows3)=>{
                                                                                if (err3) throw err3;
                                                                                var currextraatk = parseInt(rows3[0].extraatk);
                                                                                var currextrahp = parseInt(rows3[0].extrahp);
                                                                                extrastatsql = "UPDATE fightstat SET extraatk = "+(currextraatk+extraaofitem)+", extrahp = "+(currextrahp+extrahofitem)+" WHERE name = '"+message.author.id+"'";
                                                                                con.query(extrastatsql);
                                                                                message.reply("**"+itemname+" **is equipped as **Main Weapon**.");
                                                                                if (quantityown==1){
                                                                                    deletesql = "DELETE FROM storage WHERE user = '"+message.author.id+"' AND item ="+args[2];
                                                                                    con.query(deletesql);
                                                                                }
                                                                                else{
                                                                                    deletesql = "UPDATE storage SET quantity ="+(quantityown-1)+" WHERE item = "+args[2]+" AND user ='"+message.author.id+"'";
                                                                                    con.query(deletesql);
                                                                                }
                                                                            })
                                                                        }
                                                                        else{
                                                                            message.reply("Are you sure you want to replace **"+rows2[0].necklace+"** with **"+itemname+"**? (yes/no)");
                                                                            var notanswered1 = true;
                                                                            bot.on('message', async message => {
                                                                                if (message.author.id==guy){
                                                                                    try{
                                                                                        if (message.content.toLowerCase()=='yes' && notanswered1){
                                                                                            con.query("SELECT * FROM item WHERE name = '"+rows2[0].necklace+"'",(err5,rows5)=>{
                                                                                                var oldatk = parseInt(rows5[0].extraatk);
                                                                                                var oldhp = parseInt(rows5[0].extrahp);
                                                                                                
                                                                                                message.reply("Replaced **"+rows2[0].necklace+"** with **"+itemname+"**.");
                                                                                                con.query("SELECT * FROM fightstat WHERE name = '"+message.author.id+"'",(err3,rows3)=>{
                                                                                                    if (err3) throw err3;
                                                                                                    var currextraatk = parseInt(rows3[0].extraatk);
                                                                                                    var currextrahp = parseInt(rows3[0].extrahp);
                                                                                                    var updateringsql = "UPDATE gear SET ring10 = '"+itemname+"' WHERE user = '"+message.author.id+"'";
                                                                                                    extrastatsql = "UPDATE fightstat SET extraatk = "+(currextraatk+extraaofitem-oldatk)+", extrahp = "+(currextrahp+extrahofitem-oldhp)+" WHERE name = '"+message.author.id+"'";
                                                                                                    con.query(extrastatsql);
                                                                                                    con.query(updateringsql);
                                                                                                    if (quantityown==1){
                                                                                                        var delsql = "DELETE FROM storage WHERE user = '"+message.author.id+"' AND item = "+args[2];
                                                                                                        con.query(delsql);
                                                                                                    }
                                                                                                    else{
                                                                                                        var delsql = "UPDATE storage SET quantity ="+(quantityown-1)+" WHERE item = "+args[2]+" AND user ='"+message.author.id+"'";
                                                                                                        con.query(delsql);
                                                                                                    }
                                                                                                })
                                                                                            })
                                                                                                            
                                                                                        }
                                                                                        else{
                                                                                            message.reply("**"+rows2[0].necklace+"** has not been replaced with **"+itemname+"**.");
                                                                                        }
                                                                                    }
                                                                                    catch{
                                                                                        message.reply("Error occured.");
                                                                                    }
                                                                                }
                                                                            })
                                                                        }
                                                                    }
                                                                })
                                                            }
                                                            else if (itemtype == "attire" || itemtype == "attire(hidden)"){
                                                                con.query("SELECT * FROM gear WHERE user = '"+message.author.id+"'",(err2,rows2)=>{
                                                                    if (rows2.lenght<1){
                                                                        message.reply("Please select a role before trying to equip an item.");
                                                                    }
                                                                    else{
                                                                        if (rows2[0].attire == null){
                                                                            equipsql = "UPDATE gear SET mask = '"+itemname+"' WHERE user = '"+guy+"'";
                                                                            con.query(equipsql);
                                                                            con.query("SELECT * FROM fightstat WHERE name = '"+message.author.id+"'",(err3,rows3)=>{
                                                                                if (err3) throw err3;
                                                                                var currextraatk = parseInt(rows3[0].extraatk);
                                                                                var currextrahp = parseInt(rows3[0].extrahp);
                                                                                extrastatsql = "UPDATE fightstat SET extraatk = "+(currextraatk+extraaofitem)+", extrahp = "+(currextrahp+extrahofitem)+" WHERE name = '"+message.author.id+"'";
                                                                                con.query(extrastatsql);
                                                                                message.reply("**"+itemname+" **is equipped as **Main Weapon**.");
                                                                                if (quantityown==1){
                                                                                    deletesql = "DELETE FROM storage WHERE user = '"+message.author.id+"' AND item ="+args[2];
                                                                                    con.query(deletesql);
                                                                                }
                                                                                else{
                                                                                    deletesql = "UPDATE storage SET quantity ="+(quantityown-1)+" WHERE item = "+args[2]+" AND user ='"+message.author.id+"'";
                                                                                    con.query(deletesql);
                                                                                }
                                                                            })
                                                                        }
                                                                        else{
                                                                            message.reply("Are you sure you want to replace **"+rows2[0].attire+"** with **"+itemname+"**? (yes/no)");
                                                                            var notanswered1 = true;
                                                                            bot.on('message', async message => {
                                                                                if (message.author.id==guy){
                                                                                    try{
                                                                                        if (message.content.toLowerCase()=='yes' && notanswered1){
                                                                                            con.query("SELECT * FROM item WHERE name = '"+rows2[0].attire+"'",(err5,rows5)=>{
                                                                                                var oldatk = parseInt(rows5[0].extraatk);
                                                                                                var oldhp = parseInt(rows5[0].extrahp);
                                                                                                
                                                                                                message.reply("Replaced **"+rows2[0].attire+"** with **"+itemname+"**.");
                                                                                                con.query("SELECT * FROM fightstat WHERE name = '"+message.author.id+"'",(err3,rows3)=>{
                                                                                                    if (err3) throw err3;
                                                                                                    var currextraatk = parseInt(rows3[0].extraatk);
                                                                                                    var currextrahp = parseInt(rows3[0].extrahp);
                                                                                                    var updateringsql = "UPDATE gear SET ring10 = '"+itemname+"' WHERE user = '"+message.author.id+"'";
                                                                                                    extrastatsql = "UPDATE fightstat SET extraatk = "+(currextraatk+extraaofitem-oldatk)+", extrahp = "+(currextrahp+extrahofitem-oldhp)+" WHERE name = '"+message.author.id+"'";
                                                                                                    con.query(extrastatsql);
                                                                                                    con.query(updateringsql);
                                                                                                    if (quantityown==1){
                                                                                                        var delsql = "DELETE FROM storage WHERE user = '"+message.author.id+"' AND item = "+args[2];
                                                                                                        con.query(delsql);
                                                                                                    }
                                                                                                    else{
                                                                                                        var delsql = "UPDATE storage SET quantity ="+(quantityown-1)+" WHERE item = "+args[2]+" AND user ='"+message.author.id+"'";
                                                                                                        con.query(delsql);
                                                                                                    }
                                                                                                })
                                                                                            })
                                                                                                            
                                                                                        }
                                                                                        else{
                                                                                            message.reply("**"+rows2[0].attire+"** has not been replaced with **"+itemname+"**.");
                                                                                        }
                                                                                    }
                                                                                    catch{
                                                                                        message.reply("Error occured.");
                                                                                    }
                                                                                }
                                                                            })
                                                                        }
                                                                    }
                                                                })
                                                            }

                                                            else if (itemtype == "pet" || itemtype == "pet(hidden)"){
                                                                con.query("SELECT * FROM gear WHERE user = '"+message.author.id+"'",(err2,rows2)=>{
                                                                    if (rows2.lenght<1){
                                                                        message.reply("Please select a role before trying to equip an item.");
                                                                    }
                                                                    else{
                                                                        if (rows2[0].pet == null){
                                                                            equipsql = "UPDATE gear SET pet = '"+itemname+"' WHERE user = '"+guy+"'";
                                                                            con.query(equipsql);
                                                                            con.query("SELECT * FROM fightstat WHERE name = '"+message.author.id+"'",(err3,rows3)=>{
                                                                                if (err3) throw err3;
                                                                                var currextraatk = parseInt(rows3[0].extraatk);
                                                                                var currextrahp = parseInt(rows3[0].extrahp);
                                                                                extrastatsql = "UPDATE fightstat SET extraatk = "+(currextraatk+extraaofitem)+", extrahp = "+(currextrahp+extrahofitem)+" WHERE name = '"+message.author.id+"'";
                                                                                con.query(extrastatsql);
                                                                                message.reply("**"+itemname+" **can now help you in fights.");
                                                                                if (quantityown==1){
                                                                                    deletesql = "DELETE FROM storage WHERE user = '"+message.author.id+"' AND item ="+args[2];
                                                                                    con.query(deletesql);
                                                                                }
                                                                                else{
                                                                                    deletesql = "UPDATE storage SET quantity ="+(quantityown-1)+" WHERE item = "+args[2]+" AND user ='"+message.author.id+"'";
                                                                                    con.query(deletesql);
                                                                                }
                                                                            })
                                                                        }
                                                                        else{
                                                                            message.reply("Are you sure you want to replace **"+rows2[0].pet+"** with **"+itemname+"**? (yes/no)");
                                                                            var notanswered1 = true;
                                                                            bot.on('message', async message => {
                                                                                if (message.author.id==guy){
                                                                                    try{
                                                                                        if (message.content.toLowerCase()=='yes' && notanswered1){
                                                                                            con.query("SELECT * FROM item WHERE name = '"+rows2[0].pet+"'",(err5,rows5)=>{
                                                                                                var oldatk = parseInt(rows5[0].extraatk);
                                                                                                var oldhp = parseInt(rows5[0].extrahp);
                                                                                                
                                                                                                message.reply("Replaced **"+rows2[0].pet+"** with **"+itemname+"**.");
                                                                                                con.query("SELECT * FROM fightstat WHERE name = '"+message.author.id+"'",(err3,rows3)=>{
                                                                                                    if (err3) throw err3;
                                                                                                    var currextraatk = parseInt(rows3[0].extraatk);
                                                                                                    var currextrahp = parseInt(rows3[0].extrahp);
                                                                                                    var updateringsql = "UPDATE gear SET ring10 = '"+itemname+"' WHERE user = '"+message.author.id+"'";
                                                                                                    extrastatsql = "UPDATE fightstat SET extraatk = "+(currextraatk+extraaofitem-oldatk)+", extrahp = "+(currextrahp+extrahofitem-oldhp)+" WHERE name = '"+message.author.id+"'";
                                                                                                    con.query(extrastatsql);
                                                                                                    con.query(updateringsql);
                                                                                                    if (quantityown==1){
                                                                                                        var delsql = "DELETE FROM storage WHERE user = '"+message.author.id+"' AND item = "+args[2];
                                                                                                        con.query(delsql);
                                                                                                    }
                                                                                                    else{
                                                                                                        var delsql = "UPDATE storage SET quantity ="+(quantityown-1)+" WHERE item = "+args[2]+" AND user ='"+message.author.id+"'";
                                                                                                        con.query(delsql);
                                                                                                    }
                                                                                                })
                                                                                            })
                                                                                                            
                                                                                        }
                                                                                        else{
                                                                                            message.reply("**"+rows2[0].pet+"** has not been replaced with **"+itemname+"**.");
                                                                                        }
                                                                                    }
                                                                                    catch{
                                                                                        message.reply("Error occured.");
                                                                                    }
                                                                                }
                                                                            })
                                                                        }
                                                                    }
                                                                })
                                                            }
                                                        }
                                                        catch{
                                                            message.reply(message.content);
                                                        }
                                                    }
                                                    else if (message.content.toLowerCase() === `no` && notanswered) {
                                                        try{
                                                            message.reply('Cancelled equipping.');
                                                            notanswered = false;
                                                        }
                                                        catch{
                                                            message.reply(message.content);
                                                        }
                                                    }

                                                    else{
                                                        notanswered = false;
                                                    }
                                                
                                                }
                                            });
                                        }
                                        
                                        else{
                                            message.reply("This item can not be equipped as gear.");
                                        }
                                    }
                                    else{
                                        message.reply("This item can only be equipped by **"+itemrole+"s**.");
                                    }
                                })
                            })
                        }
                    })
                }
                else{
                    message.reply("Enter item number of item to be equipped.\nExample: **"+prefix+" equip 4**.");
                }
                break;
            case "gear":
            case "equipment":
            case "attire":
            case "clothes":
            case "cloth":
            case "ring":
            case "rings":
            case "mask":
            case "necklace":
            case "weapon":
            case "offweapon":
            case "mainweapon":
                con.query("SELECT * FROM gear WHERE user = '"+message.author.id+"'",(err,rows) =>{
                    if (err) throw err;
                    if (rows.length<1){
                        message.reply("Choose a role first.");
                    }
                    else{
                        var mainweapon = rows[0].mainweapon;
                        var offweapon = rows[0].offweapon;
                        if (offweapon==null){
                            offweapon="\u200b";
                        }
                        var mask = rows[0].mask;
                        if (mask==null){
                            mask="\u200b";
                        }
                        var necklace = rows[0].necklace;
                        if (necklace==null){
                            necklace="\u200b";
                        }
                        var attire = rows[0].attire;
                        if (attire==null){
                            attire="\u200b";
                        }
                        var rings = "\u200b";
                        if (rows[0].ring1!=null){
                            rings="**1** "+rows[0].ring1+" ";
                            if (rows[0].ring2!=null){
                                rings+="**2** "+rows[0].ring2+"\n ";
                                if (rows[0].ring3!=null){
                                    rings+="**3** "+rows[0].ring3+" ";
                                    if (rows[0].ring4!=null){
                                        rings+="**4** "+rows[0].ring4+"\n ";
                                        if (rows[0].ring5!=null){
                                            rings+="**5** "+rows[0].ring5+" ";
                                            if (rows[0].ring6!=null){
                                                rings+="**6** "+rows[0].ring6+"\n ";
                                                if (rows[0].ring7!=null){
                                                    rings+="**7** "+rows[0].ring7+" ";
                                                    if (rows[0].ring8!=null){
                                                        rings+="**8** "+rows[0].ring8+"\n ";
                                                        if (rows[0].ring9!=null){
                                                            rings+="**9** "+rows[0].ring9+" ";
                                                            if (rows[0].ring10!=null){
                                                                rings+="**10** "+rows[0].ring10;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        const embed = new Discord.MessageEmbed()
                        .setTitle("**"+message.author.username+"'s** Equipment.")
                        .setDescription("You can buy and equip items to increase stats.")
                        .addField("Mask:",mask)
                        .addField("Rings:",rings,true)
                        .addField("Necklace:",necklace,true)
                        .addField("Attire:",attire)
                        .addField("Main Weapon:",mainweapon,true)
                        .addField("Off Weapon:",offweapon,true)
                        .setColor("#FFFF99")
                        .setThumbnail();
                        message.reply(embed);
                    
                    }
                })
                break;
            case "plant":
                if (args[2]==null){
                    message.reply("Enter item number of seed to be planted.\nExample: **"+prefix+" plant 34**.");
                }
                else{
                    args2 = parseInt(args[2]);
                    if (!isNaN(args2)){
                        con.query("SELECT * FROM item WHERE number = "+args2,(err,rows)=>{
                            if (err) throw err;
                            if (rows.length<1){
                                message.reply("Item not found.");
                            }
                            else{
                                var itype = rows[0].type;
                                if (itype=="seed"||itype=="seed(hidden)"||itype=="craftable/seed"){
                                    con.query("SELECT * FROM plantinfo WHERE itemnumber = "+args2,(err1,rows1)=>{
                                        if (err1) throw err1;
                                        var seedname = rows1[0].itemname;
                                        var harvestitem = rows1[0].harvestitem;
                                        var monthstogrow = rows1[0].monthstogrow;
                                        var daystogrow = rows1[0].daystogrow;
                                        var minq = rows1[0].quantitymin;
                                        var maxq = rows1[0].quantitymax;
                                        var day = date.getDate();
                                        var month = date.getMonth();
                                        var harvestq = Math.floor(Math.random() * maxq + minq);
                                        daystogrow = (parseInt(daystogrow) + (parseInt(monthstogrow)*30));
                                        var addtogardensql = "INSERT INTO garden VALUES ('"+message.author.id+"','"+seedname+"',"+day+","+month+",1,"+daystogrow+","+harvestitem+","+harvestq+")";
                                        con.query(addtogardensql);
                                        message.reply("**"+seedname+"** has been planted and will be ready in **"+daystogrow+"** days.")
                                    })
                                }
                                else{
                                    message.reply("This item cannot be grown.");
                                }
                            }
                        })
                    }
                }
            }//dont put case after this.
        }
    })
bot.login(token);