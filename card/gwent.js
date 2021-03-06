'use strict';
game.import('card',function(lib,game,ui,get,ai,_status){
	return {
		name:'gwent',
		card:{
			gw_dieyi:{
				fullskin:true
			},
			gw_dieyi_equip1:{
				fullskin:true,
				vanish:true,
				hidden:true,
				cardimage:'gw_dieyi',
				type:'equip',
				subtype:'equip1',
				onLose:function(){
					lib.skill.gw_dieyi.process(player);
				},
				loseDelay:false,
				skills:[],
				ai:{
					equipValue:0
				}
			},
			gw_dieyi_equip2:{
				fullskin:true,
				vanish:true,
				hidden:true,
				cardimage:'gw_dieyi',
				type:'equip',
				subtype:'equip2',
				onLose:function(){
					lib.skill.gw_dieyi.process(player);
				},
				loseDelay:false,
				skills:[],
				ai:{
					equipValue:0
				}
			},
			gw_dieyi_equip3:{
				fullskin:true,
				vanish:true,
				hidden:true,
				cardimage:'gw_dieyi',
				type:'equip',
				subtype:'equip3',
				onLose:function(){
					lib.skill.gw_dieyi.process(player);
				},
				loseDelay:false,
				skills:[],
				ai:{
					equipValue:0
				}
			},
			gw_dieyi_equip4:{
				fullskin:true,
				vanish:true,
				hidden:true,
				cardimage:'gw_dieyi',
				type:'equip',
				subtype:'equip4',
				onLose:function(){
					lib.skill.gw_dieyi.process(player);
				},
				loseDelay:false,
				skills:[],
				ai:{
					equipValue:0
				}
			},
			gw_dieyi_equip5:{
				fullskin:true,
				vanish:true,
				hidden:true,
				cardimage:'gw_dieyi',
				type:'equip',
				subtype:'equip5',
				onLose:function(){
					lib.skill.gw_dieyi.process(player);
				},
				loseDelay:false,
				skills:[],
				ai:{
					equipValue:0
				}
			},
			gw_dieyi_judge:{
				fullskin:true,
				vanish:true,
				hidden:true,
				cardimage:'gw_dieyi',
				enable:true,
				type:'delay',
				filterTarget:true,
				effect:function(){
					lib.skill.gw_dieyi.process(player);
				},
			},
			gw_hudiewu:{
				fullborder:'gold',
				type:'spell',
				subtype:'spell_gold',
				vanish:true,
				enable:function(card,player){
					return game.hasPlayer(function(current){
						return current!=player&&current.countCards('ej');
					});
				},
				notarget:true,
				contentBefore:function(){
					player.$skill('蝴蝶舞','legend','metal');
					game.delay(2);
				},
				content:function(){
					'step 0'
					event.targets=game.filterPlayer(function(current){
						return current.countCards('ej');
					}).sortBySeat();
					event.targets.remove(player);
					'step 1'
					if(event.targets.length){
						var target=event.targets.shift();
						var ej=target.getCards('ej');
						player.line(target);
						target.removeEquipTrigger();
						for(var i=0;i<ej.length;i++){
							ui.discardPile.appendChild(game.createCard(ej[i]));
							ej[i].init([ej[i].suit,ej[i].number,'gw_dieyi_'+(get.subtype(ej[i])||'judge')]);
						}
						event.redo();
					}
				},
				contentAfter:function(){
					var evt=_status.event.getParent('phaseUse');
					if(evt&&evt.name=='phaseUse'){
						evt.skipped=true;
					}
				},
				ai:{
					value:6,
					useful:[6,1],
					result:{
						player:function(player){
							return game.countPlayer(function(current){
								if(current==player) return;
								return -(current.countCards('e')-current.countCards('j')/3)*get.sgn(get.attitude(player,current));
							});
						}
					},
					order:0.7,
				}
			},
			gw_yigeniyin:{
				fullborder:'gold',
				type:'spell',
				subtype:'spell_gold',
				vanish:true,
				enable:true,
				notarget:true,
				contentBefore:function(){
					player.$skill('伊格尼印','legend','metal');
					game.delay(2);
				},
				content:function(){
					'step 0'
					var enemies=player.getEnemies();
					var target=get.max(enemies,'hp','list').randomGet();
					if(target){
						player.line(target,'fire');
						target.damage('fire');
						game.delay();
					}
					'step 1'
					event.targets=game.filterPlayer(function(current){
						return current.isMaxHp();
					}).sortBySeat();
					player.line(event.targets,'fire');
					'step 2'
					if(event.targets.length){
						var target=event.targets.shift();
						player.line(target,'fire');
						target.damage('fire');
						event.redo();
					}
				},
				contentAfter:function(){
					var evt=_status.event.getParent('phaseUse');
					if(evt&&evt.name=='phaseUse'){
						evt.skipped=true;
					}
				},
				ai:{
					value:8,
					useful:[6,1],
					result:{
						player:function(player){
							var enemies=player.getEnemies();
							var players=game.filterPlayer();
							var func=function(current){
								return current.hp;
							};
							var max1=get.max(enemies,func);
							for(var i=0;i<players.length;i++){
								if(players[i].hp==max1){
									players.splice(i,1);break;
								}
							}
							var max2=get.max(players,func);
							if(max1-1>max2){
								return get.damageEffect(get.max(enemies,func,'item'),player,player,'fire');
							}
							else{
								var num;
								if(max1>max2){
									num=get.sgn(get.damageEffect(get.max(enemies,func,'item'),player,player,'fire'));
								}
								else if(max1==max2){
									num=0;
								}
								else{
									num=1;
								}
								return num+game.countPlayer(function(current){
									if(current.hp>=max2){
										return get.sgn(get.damageEffect(current,player,player,'fire'));
									}
								});
							}
						}
					},
					order:0.7,
				}
			},
			gw_leizhoushu:{
				fullborder:'gold',
				type:'spell',
				subtype:'spell_gold',
				vanish:true,
				enable:true,
				notarget:true,
				contentBefore:function(){
					player.$skill('雷咒术','legend','metal');
					game.delay(2);
				},
				content:function(){
					if(player.hasSkill('gw_leizhoushu')){
						if(typeof player.storage.gw_leizhoushu!='number'){
							player.storage.gw_leizhoushu=2;
						}
						else{
							player.storage.gw_leizhoushu++;
						}
						player.syncStorage('gw_leizhoushu');
						player.updateMarks();
					}
					else{
						player.addSkill('gw_leizhoushu');
					}
				},
				contentAfter:function(){
					var evt=_status.event.getParent('phaseUse');
					if(evt&&evt.name=='phaseUse'){
						evt.skipped=true;
					}
				},
				ai:{
					value:8,
					useful:[6,1],
					result:{
						player:function(player){
							return 1+game.countPlayer(function(current){
								if(current!=player&&current.isMaxHandcard()){
									return -get.sgn(get.attitude(player,current));
								}
							});
						}
					},
					order:0.5,
				}
			},
			gw_aerdeyin:{
				fullborder:'gold',
				type:'spell',
				subtype:'spell_gold',
				vanish:true,
				enable:true,
				notarget:true,
				contentBefore:function(){
					player.$skill('阿尔德印','legend','metal');
					game.delay(2);
				},
				content:function(){
					'step 0'
					var list=game.filterPlayer(function(current){
						return get.distance(player,current,'pure')==1;
					});
					event.list=list.sortBySeat();
					'step 1'
					if(event.list.length){
						var target=event.list.shift();
						event.target=target;
						player.line(target,'green');
						target.damage();
						target.draw(false);
						target.$draw();
					}
					else{
						delete event.target;
					}
					'step 2'
					if(event.target){
						event.target.out();
						event.goto(1);
					}
					'step 3'
					game.delay();
				},
				contentAfter:function(){
					var evt=_status.event.getParent('phaseUse');
					if(evt&&evt.name=='phaseUse'){
						evt.skipped=true;
					}
				},
				ai:{
					value:8,
					useful:[6,1],
					result:{
						player:function(player){
							return game.countPlayer(function(current){
								if(get.distance(player,current,'pure')==1){
									var att=get.sgn(get.attitude(player,current));
									if(current==player.next){
										return -att*1.5;
									}
									return -att;
								}
							});
						}
					},
					order:0.5,
				}
			},
			gw_ansha:{
				fullborder:'gold',
				type:'spell',
				subtype:'spell_gold',
				vanish:true,
				enable:function(card,player){
					var enemies=player.getEnemies();
					return game.hasPlayer(function(current){
						return current.hp==1&&enemies.contains(current);
					});
				},
				notarget:true,
				contentBefore:function(){
					player.$skill('暗杀','legend','metal');
					game.delay(2);
				},
				content:function(){
					var enemies=player.getEnemies();
					var list=game.filterPlayer(function(current){
						return current.hp==1&&enemies.contains(current);
					});
					if(list.length){
						var target=list.randomGet();
						player.line(target);
						target.die();
					}
				},
				contentAfter:function(){
					var evt=_status.event.getParent('phaseUse');
					if(evt&&evt.name=='phaseUse'){
						evt.skipped=true;
					}
				},
				ai:{
					value:8,
					useful:[6,1],
					result:{
						player:1
					},
					order:0.6,
				}
			},
			gw_xinsheng:{
				fullborder:'gold',
				type:'spell',
				subtype:'spell_gold',
				vanish:true,
				enable:function(card,player){
					return game.hasPlayer(function(current){
						return !current.isUnseen();
					});
				},
				notarget:true,
				contentBefore:function(){
					player.$skill('新生','legend','metal');
					game.delay(2);
				},
				content:function(){
					'step 0'
					var target=get.max(game.filterPlayer(function(current){
						return !current.isUnseen();
					},'list').randomSort(),function(current){
						var att=get.attitude(player,current);
						if(att<0&&current.isDamaged()&&current.hp<=3){
							return -10;
						}
						var rank=get.rank(current,true);
						if(current.maxHp>=3){
							if(current.hp<=1){
								if(att>0) return att*3+2;
								return att*3;
							}
							else if(current.hp==2){
								if(att>0){
									att*=1.5;
								}
								else{
									att/=1.5;
								}
							}
						}
						if(rank>=7){
							if(att>0){
								return att/10;
							}
							return -att/5;
						}
						else if(rank<=4){
							if(att<0){
								return -att/10;
							}
							return att;
						}
						return Math.abs(att/2);
					},'item');
					event.aitarget=target;
					var list=[];
					for(var i in lib.character){
						if(!lib.filter.characterDisabled(i)){
							list.push(i);
						}
					}
    				var players=game.players.concat(game.dead);
    				for(var i=0;i<players.length;i++){
    					list.remove(players[i].name);
    					list.remove(players[i].name1);
    					list.remove(players[i].name2);
    				}
    				var dialog=ui.create.dialog('选择一张武将牌','hidden');
    				dialog.add([list.randomGets(12),'character']);
    				player.chooseButton(dialog,true).ai=function(button){
						if(get.attitude(player,event.aitarget)>0){
							return get.rank(button.link,true);
						}
						else{
							return -get.rank(button.link,true);
						}
    				};
    				'step 1'
					event.nametarget=result.links[0];
					player.chooseTarget(true,'使用'+get.translation(event.nametarget)+'替换一名角色的武将牌',function(card,player,target){
						return !target.isUnseen()&&!target.isMin();
					}).ai=function(target){
						if(target==event.aitarget){
							return 1;
						}
						else{
							return 0;
						}
					}
					'step 2'
					var target=result.targets[0];
    				target.reinit(target.name,event.nametarget);
                    target.hp=target.maxHp;
                    target.update();
					player.line(target,'green');
				},
				contentAfter:function(){
					var evt=_status.event.getParent('phaseUse');
					if(evt&&evt.name=='phaseUse'){
						evt.skipped=true;
					}
				},
				ai:{
					value:8,
					useful:[6,1],
					result:{
						player:1
					},
					order:0.5,
				}
			},
			gw_niuquzhijing:{
				fullborder:'gold',
				type:'spell',
				subtype:'spell_gold',
				vanish:true,
				enable:function(card,player){
					return game.hasPlayer(function(current){
						return current.hp!=player.hp;
					});
				},
				notarget:true,
				contentBefore:function(){
					var list1=game.filterPlayer(function(current){
						return current.isMaxHp();
					});
					var list2=game.filterPlayer(function(current){
						return current.isMinHp();
					});
					player.line(list1);
					for(var i=0;i<list1.length;i++){
						list1[i].animate('target');
					}
					setTimeout(function(){
						var list11=list1.slice(0);
						var list22=list2.slice(0);
						while(list22.length>list11.length){
							list11.push(list1.randomGet());
						}
						while(list22.length<list11.length){
							list22.push(list2.randomGet());
						}
						list11.sortBySeat();
						list22.sortBySeat();
						while(list11.length){
							list11.shift().line(list22.shift(),'green');
						}
					},500);
					player.$skill('纽曲之镜','legend','metal');
					game.delay(2);
				},
				content:function(){
					var max=null,min=null;
					for(var i=0;i<game.players.length;i++){
						if(game.players[i].isMaxHp()){
							max=game.players[i].hp;break;
						}
					}
					for(var i=0;i<game.players.length;i++){
						if(game.players[i].isMinHp()){
							min=game.players[i].hp;break;
						}
					}
					var targets=game.filterPlayer();
					if(max!=min&&max!=null&&min!=null){
						for(var i=0;i<targets.length;i++){
							if(targets[i].hp==max){
								targets[i].hp--;
								targets[i].maxHp--;
								targets[i].$damagepop(-1);
							}
							else if(targets[i].hp==min){
								targets[i].hp++;
								targets[i].maxHp++;
								targets[i].$damagepop(1,'wood');
							}
							targets[i].update();
						}
					}
				},
				contentAfter:function(){
					var evt=_status.event.getParent('phaseUse');
					if(evt&&evt.name=='phaseUse'){
						evt.skipped=true;
					}
				},
				ai:{
					value:8,
					useful:[6,1],
					result:{
						player:function(player,target){
							return game.countPlayer(function(current){
								if(current.isMaxHp()){
									return -get.sgn(get.attitude(player,current));
								}
								if(current.isMinHp()){
									return get.sgn(get.attitude(player,current));
								}
							});
						}
					},
					order:3.5,
				}
			},
			gw_zhongmozhizhan:{
				fullborder:'gold',
				type:'spell',
				subtype:'spell_gold',
				vanish:true,
				enable:true,
				notarget:true,
				contentBefore:function(){
					player.line(game.filterPlayer());
					player.$skill('终末之战','legend','metal');
					game.delay(2);
				},
				content:function(){
					'step 0'
					event.num=0;
					event.targets=game.filterPlayer().sortBySeat();
					'step 1'
					if(event.num<targets.length){
						ui.clear();
						var target=targets[event.num];
						var cards=target.getCards('hej');
						target.lose(cards)._triggered=null;
						target.$throw(cards);
						event.num++;
						event.redo();
						game.delay(0.7);
					}
					'step 2'
					ui.clear();
				},
				contentAfter:function(){
					var evt=_status.event.getParent('phaseUse');
					if(evt&&evt.name=='phaseUse'){
						evt.skipped=true;
					}
				},
				ai:{
					value:8,
					useful:[6,1],
					result:{
						player:function(player,target){
							if(player.hasUnknown()) return 0;
							return -game.countPlayer(function(current){
								return current.countCards('he')*get.sgn(get.attitude(player,current));
							});
						}
					},
					order:0.5,
				}
			},

			gw_youer:{
				fullborder:'silver',
				type:'spell',
				subtype:'spell_silver',
				vanish:true,
				enable:true,
				filterTarget:function(card,player,target){
					return target!=player&&target.countCards('h')>0;
				},
				content:function(){
					'step 0'
					var cards=target.getCards('h');
					target.lose(cards,ui.special);
					target.storage.gw_youer=cards;
					target.addSkill('gw_youer');
					'step 1'
					player.draw();
				},
				ai:{
					basic:{
						order:10,
						value:7,
						useful:[3,1],
					},
					result:{
						target:function(player,target){
							if(target.hasSkillTag('noh')) return 3;
							var num=-Math.sqrt(target.countCards('h'));
							if(player.hasSha()&&player.canUse('sha',target)){
								num-=2;
							}
							return num;
						},
					},
				}
			},
			gw_tongdi:{
				fullborder:'silver',
				type:'spell',
				subtype:'spell_silver',
				vanish:true,
				enable:true,
				filterTarget:function(card,player,target){
					return target!=player;
				},
				content:function(){
					'step 0'
					if(!player.countCards('h')){
						event.finish();
					}
					else{
						player.chooseCard('h','将一张手牌交给'+get.translation(target),true);
					}
					'step 1'
					player.$giveAuto(result.cards,target);
					target.gain(result.cards,player);
					'step 2'
					player.gainPlayerCard(target,'h',true,2,'visible').set('ai',function(button){
						return get.value(button.link);
					});
				},
				ai:{
					basic:{
						order:8,
						value:9.5,
						useful:[5,1],
					},
					result:{
						target:function(player,target){
							if(player.countCards('h','gw_tongdi')==player.countCards('h')) return 0;
							if(!target.countCards('h')) return 0;
							return -1;
						},
						player:function(player,target){
							if(player.countCards('h','gw_tongdi')==player.countCards('h')) return 0;
							if(!target.countCards('h')) return 0;
							return 0.5;
						},
					},
				}
			},
			gw_fuyuan:{
				fullborder:'silver',
				type:'spell',
				subtype:'spell_silver',
				vanish:true,
				savable:true,
				selectTarget:-1,
				content:function(){
					target.recover();
					target.changeHujia();
				},
				ai:{
					basic:{
						order:6,
						useful:10,
						value:[8,6.5,5,4],
					},
					result:{
						target:2
					},
					tag:{
						recover:1,
						save:1,
					}
				}
			},
			gw_zhuoshao:{
				fullborder:'silver',
				type:'spell',
				subtype:'spell_silver',
				vanish:true,
				enable:true,
				filterTarget:function(card,player,target){
					return target.isMaxHp();
				},
				cardnature:'fire',
				selectTarget:[1,Infinity],
				content:function(){
					target.damage('fire');
				},
				ai:{
					basic:{
						order:8.5,
						value:7.5,
						useful:[4,1],
					},
					result:{
						target:-1
					},
					tag:{
						damage:1,
						fireDamage:1,
						natureDamage:1,
					}
				}
			},
			gw_butianshu:{
				fullborder:'silver',
				type:'spell',
				subtype:'spell_silver',
				vanish:true,
				enable:true,
				filterTarget:true,
				// contentBefore:function(){
				// 	player.$skill('卜天术','legend','water');
				// 	game.delay(2);
				// },
				content:function(){
					'step 0'
    				var list=[];
    				for(var i in lib.card){
    					if(lib.card[i].mode&&lib.card[i].mode.contains(lib.config.mode)==false) continue;
						if(lib.card[i].vanish) continue;
    					if(lib.card[i].type=='delay') list.push([cards[0].suit,cards[0].number,i]);
    				}
    				var dialog=ui.create.dialog('卜天术',[list,'vcard']);
					var bing=target.countCards('h')<=1;
    				player.chooseButton(dialog,true,function(button){
                        if(get.effect(target,{name:button.link[2]},player,player)>0){
							if(button.link[2]=='bingliang'){
                                if(bing) return 2;
                                return 0.7;
        					}
        					if(button.link[2]=='lebu'){
        						return 1;
        					}
        					if(button.link[2]=='guiyoujie'){
        						return 0.5;
        					}
        					if(button.link[2]=='caomu'){
        						return 0.3;
        					}
        					return 0.2;
                        }
                        return 0;
    				}).filterButton=function(button){
    					return !target.hasJudge(button.link[2]);
    				};
    				'step 1'
					var card=game.createCard(result.links[0][2]);
					event.judgecard=card;
					target.$draw(card);
					game.delay(0.7);
					'step 2'
    				target.addJudge(event.judgecard);
				},
				ai:{
					value:8,
					useful:[5,1],
					result:{
						player:function(player,target){
							var eff=0;
							for(var i in lib.card){
								if(lib.card[i].type=='delay'){
									var current=get.effect(target,{name:i},player,player);
									if(current>eff){
										eff=current;
									}
								}
							}
							return eff;
						}
					},
					order:6,
				}
			},
			gw_shizizhaohuan:{
				fullborder:'silver',
				type:'spell',
				subtype:'spell_silver',
				vanish:true,
				enable:true,
				filterTarget:function(card,player,target){
					return target==player;
				},
				selectTarget:-1,
				// contentBefore:function(){
				// 	player.$skill('十字召唤','legend','water');
				// 	game.delay(2);
				// },
				content:function(){
    				var list=[];
					list.push(get.cardPile('juedou','cardPile'));
					list.push(get.cardPile('huogong','cardPile'));
					list.push(get.cardPile('nanman','cardPile'));
					list.push(get.cardPile('huoshaolianying','cardPile'));
					for(var i=0;i<list.length;i++){
						if(!list[i]) list.splice(i--,1);
					}
					list=[list.randomGet()];
					var sha=get.cardPile('sha','cardPile');
					if(sha){
						if(list.length){
							list.push(sha);
						}
						else{
							sha.remove();
							list.push(sha);
							var sha2=get.cardPile('sha','cardPile');
							if(sha2){
								list.push(sha2);
							}
						}
					}
					if(list.length){
						target.gain(list,'gain2','log');
					}
				},
				ai:{
					value:8,
					useful:[6,1],
					result:{
						player:1
					},
					order:6,
				}
			},
			gw_zuihouyuanwang:{
				fullborder:'silver',
				type:'spell',
				subtype:'spell_silver',
				vanish:true,
				enable:true,
				filterTarget:function(card,player,target){
					return target==player;
				},
				selectTarget:-1,
				// contentBefore:function(){
				// 	player.$skill('最后愿望','legend','water');
				// 	game.delay(2);
				// },
				content:function(){
					'step 0'
					event.num=game.countPlayer();
					player.draw(event.num);
					'step 1'
					player.chooseToDiscard(true,event.num,'he');
				},
				ai:{
					value:6,
					useful:[4,1],
					result:{
						player:function(player){
							var num=player.countCards('he');
							if(num<=1) return 0;
							if(num<=3&&!player.needsToDiscard()) return 0;
							return 1;
						}
					},
					order:7,
				}
			},

			gw_zirankuizeng:{
				fullborder:'silver',
				type:'spell',
				subtype:'spell_silver',
				vanish:true,
				enable:true,
				notarget:true,
				// contentBefore:function(){
				// 	player.$skill('自然馈赠','legend','water');
				// 	game.delay(2);
				// },
				content:function(){
					'step 0'
    				var list=[];
    				for(var i in lib.card){
						if(lib.card[i].subtype=='spell_bronze') list.push([cards[0].suit,cards[0].number,i]);
    				}
    				var dialog=ui.create.dialog('自然馈赠',[list,'vcard']);
					var rand=get.rand();
					var aozu=game.hasPlayer(function(current){
						return player.canUse('gw_aozuzhilei',current)&&current.hp<=3&&get.effect(current,{name:'gw_aozuzhilei'},player,player)>0;
					});
					var aozu2=game.hasPlayer(function(current){
						return player.canUse('gw_aozuzhilei',current)&&current.hp<=2&&get.effect(current,{name:'gw_aozuzhilei'},player,player)>0;
					});
					var aozu3=game.hasPlayer(function(current){
						return player.canUse('gw_aozuzhilei',current)&&get.effect(current,{name:'gw_aozuzhilei'},player,player)>0;
					});
					var baoxue=game.hasPlayer(function(current){
						return player.canUse('gw_baoxueyaoshui',current)&&get.attitude(player,current)<0&&[2,3].contains(current.countCards('h'))&&!current.hasSkillTag('noh');
					});
					var baoxue2=game.hasPlayer(function(current){
						return player.canUse('gw_baoxueyaoshui',current)&&get.attitude(player,current)<0&&[2].contains(current.countCards('h'))&&!current.hasSkillTag('noh');
					});
					var baoxue3=game.hasPlayer(function(current){
						return player.canUse('gw_baoxueyaoshui',current)&&get.attitude(player,current)<0&&current.countCards('h')>=2&&!current.hasSkillTag('noh');
					});
					var nongwu=game.hasPlayer(function(current){
						return get.attitude(player,current)<0&&(get.attitude(player,current.getNext())<0||get.attitude(player,current.getPrevious())<0);
					});
					var nongwu2=game.hasPlayer(function(current){
						return get.attitude(player,current)<0&&get.attitude(player,current.getNext())<0&&get.attitude(player,current.getPrevious())<0;
					});
    				player.chooseButton(dialog,true,function(button){
						var name=button.link[2];
						switch(name){
							case 'gw_birinongwu':
								if(nongwu2) return 3;
								if(nongwu) return 1;
								return 0;
							case 'gw_baoxueyaoshui':
								if(baoxue2) return 2;
								if(baoxue) return 1.5;
								if(baoxue3) return 0.5;
								return 0;
							case 'gw_aozuzhilei':
								if(aozu2) return 2.5;
								if(aozu) return 1.2;
								if(aozu3) return 0.2;
								return 0;
						}
						if(game.hasPlayer(function(current){
							return player.canUse(name,current)&&get.effect(current,{name:name},player,player)>0;
						})){
							return Math.random();
						}
    					return 0;
    				}).filterButton=function(button){
						var name=button.link[2];
						if(!lib.card[name].notarget){
							return game.hasPlayer(function(current){
								return player.canUse(name,current);
							})
						}
    					return true;
    				};
    				'step 1'
					var fakecard=game.createCard(result.links[0][2]);
					event.fakecard=fakecard;
					if(get.info(fakecard).notarget){
						player.useCard(fakecard);
						event.finish();
					}
					else{
						player.chooseTarget('选择'+get.translation(fakecard)+'的目标',function(card,player,target){
							return player.canUse(fakecard,target);
						},true).ai=function(target){
							return get.effect(target,fakecard,player,player);
						};
					}
					'step 2'
					if(result.bool&&result.targets&&result.targets.length){
						player.useCard(event.fakecard,result.targets);
					}
				},
				ai:{
					value:6,
					useful:[4,1],
					result:{
						player:function(player){
							return 1;
						}
					},
					order:7,
				}
			},
			gw_qinpendayu:{
				fullborder:'bronze',
				type:'spell',
				subtype:'spell_bronze',
				enable:true,
				filterTarget:true,
	            changeTarget:function(player,targets){
	                game.filterPlayer(function(current){
	                    return get.distance(targets[0],current,'pure')==1;
	                },targets);
				},
				usable:1,
				content:function(){
					target.addTempSkill('gw_qinpendayu',{player:'phaseAfter'});
				},
				ai:{
					value:4,
					useful:[3,1],
					result:{
						player:function(player,target){
	                        return game.countPlayer(function(current){
	                            if(current==target||(get.distance(target,current,'pure')==1)){
	        						var num=-get.sgn(get.attitude(player,current));
									if(current.needsToDiscard()) return num;
									if(current.needsToDiscard(1)) return 0.7*num;
									if(current.needsToDiscard(2)) return 0.4*num;
									return 0.1*num;
	        					}
	                        });
	                    }
					},
					order:1.2,
					tag:{
						multitarget:1,
						multineg:1,
					}
				}
			},
			gw_birinongwu:{
				fullborder:'bronze',
				type:'spell',
				subtype:'spell_bronze',
				enable:true,
				usable:1,
				filterTarget:true,
	            changeTarget:function(player,targets){
	                game.filterPlayer(function(current){
	                    return get.distance(targets[0],current,'pure')==1;
	                },targets);
				},
				content:function(){
					target.addTempSkill('gw_birinongwu',{player:'phaseAfter'});
				},
				ai:{
					value:4,
					useful:[3,1],
					result:{
						player:function(player,target){
	                        return game.countPlayer(function(current){
	                            if(current==target||(get.distance(target,current,'pure')==1)){
	        						return -get.sgn(get.attitude(player,current));
	        					}
	                        });
	                    }
					},
					order:1.2,
					tag:{
						multitarget:1,
						multineg:1,
					}
				}
			},
			gw_ciguhanshuang:{
				fullborder:'bronze',
				type:'spell',
				subtype:'spell_bronze',
				enable:true,
				usable:1,
				filterTarget:true,
	            changeTarget:function(player,targets){
	                game.filterPlayer(function(current){
	                    return get.distance(targets[0],current,'pure')==1;
	                },targets);
				},
				content:function(){
					target.addSkill('gw_ciguhanshuang');
				},
				ai:{
					value:4,
					useful:[3,1],
					result:{
						player:function(player,target){
	                        return game.countPlayer(function(current){
	                            if(current==target||(get.distance(target,current,'pure')==1)){
	        						return -get.sgn(get.attitude(player,current));
	        					}
	                        });
	                    }
					},
					order:1.2,
					tag:{
						multitarget:1,
						multineg:1,
					}
				}
			},
			gw_baoxueyaoshui:{
				fullborder:'bronze',
				type:'spell',
				subtype:'spell_bronze',
				enable:true,
				filterTarget:true,
				content:function(){
					'step 0'
					target.chooseToDiscard('h',2,true).delay=false;
					'step 1'
					target.draw();
				},
				ai:{
					value:6,
					useful:[3,1],
					result:{
						target:function(player,target){
							if(target.hasSkillTag('noh')) return 0.1;
							switch(target.countCards('h')){
								case 0:return 0.5;
								case 1:return 0;
								case 2:return -1.5;
								default:return -1;
							}
						}
					},
					order:8,
					tag:{
						loseCard:1,
						discard:1,
					}
				}
			},
			gw_zhihuanjun:{
				fullborder:'bronze',
				type:'spell',
				subtype:'spell_bronze',
				enable:true,
				filterTarget:function(card,player,target){
					return target.isDamaged();
				},
				content:function(){
					target.loseMaxHp(true);
				},
				ai:{
					value:4,
					useful:[3,1],
					result:{
						target:function(player,target){
							if(target.maxHp-target.hp==1){
								return -1/target.maxHp;
							}
							else{
								return -1/target.maxHp/3;
							}
						}
					},
					order:8,
				}
			},
			gw_zumoshoukao:{
				fullborder:'bronze',
				type:'spell',
				subtype:'spell_bronze',
				enable:true,
				filterTarget:function(card,player,target){
					return target.hujia||!target.hasSkill('fengyin');
				},
				content:function(){
					target.addTempSkill('fengyin',{player:'phaseAfter'});
					if(target.hujia){
						target.changeHujia(-target.hujia);
					}
				},
				ai:{
					value:4,
					useful:[4,1],
					result:{
						target:function(player,target){
							var threaten=get.threaten(target,player,true);
							if(target.hujia){
								threaten*=(target.hujia+1);
							}
							else if(target.hasSkill('fengyin')){
								return 0;
							}
							if(target.hasSkillTag('maixie_hp')){
								threaten*=1.5;
							}
							return -threaten;
						}
					},
					order:9.5,
				}
			},
			gw_aozuzhilei:{
				fullborder:'bronze',
				type:'spell',
				subtype:'spell_bronze',
				enable:true,
				cardnature:'thunder',
				filterTarget:function(card,player,target){
					return target.hp>=player.hp;
				},
				content:function(){
					'step 0'
					target.damage('thunder');
					'step 1'
					if(target.isIn()){
						target.draw();
					}
				},
				ai:{
					basic:{
						order:1.8,
						value:[6,1],
						useful:[4,1],
					},
					result:{
						target:-1
					},
					tag:{
						damage:1,
						thunderDamage:1,
						natureDamage:1,
					}
				}
			},
			gw_poxiao:{
				fullborder:'bronze',
				type:'spell',
				subtype:'spell_bronze',
				enable:true,
				notarget:true,
				content:function(){
					'step 0'
					var choice=1;
					if(game.countPlayer(function(current){
						if(current.countCards('j')){
							if(get.attitude(player,current)>0){
								choice=0;
							}
							return true;
						}
					})){
						player.chooseControl(function(){
							return choice;
						}).set('choiceList',[
							'弃置一名角色判定区内的所有牌',
							'随机获得一张铜卡法术（破晓除外）并展示之'
						]);
					}
					else{
						event.directfalse=true;
					}
					'step 1'
					if(!event.directfalse&&result.index==0){
						player.chooseTarget(true,'弃置一名角色判定区内的所有牌',function(card,player,target){
							return target.countCards('j');
						}).ai=function(target){
							return get.attitude(player,target)*target.countCards('j');
						};
					}
					else{
						var list=get.libCard(function(info,name){
							return name!='gw_poxiao'&&info.subtype=='spell_bronze';
						});
						if(list.length){
							player.gain(game.createCard(list.randomGet()),'gain2');
						}
						else{
							player.draw();
						}
						event.finish();
					}
					'step 2'
					if(result.targets[0]){
						player.line(result.targets[0],'green');
						result.targets[0].discard(result.targets[0].getCards('j'));
					}
				},
				ai:{
					order:4,
					useful:[3,1],
					result:{
						player:1,
					}
				}
			}
		},
		skill:{
			gw_youer:{
    			trigger:{global:['phaseEnd','dieBegin']},
    			forced:true,
    			audio:false,
    			mark:true,
    			intro:{
    				content:'cards'
    			},
    			content:function(){
    				if(player.storage.gw_youer){
						if(trigger.name=='phase'){
							player.gain(player.storage.gw_youer);
						}
    					else{
							player.$throw(player.storage.gw_youer,1000);
		    				for(var i=0;i<player.storage.gw_youer.length;i++){
		    					ui.discardPile.appendChild(player.storage.gw_youer[i]);
		    				}
		    				game.log(player,'弃置了',player.storage.gw_youer);
						}
    				}
					delete player.storage.gw_youer;
    				player.removeSkill('gw_youer');
    			},
    		},
			gw_qinpendayu:{
    			mark:true,
				nopop:true,
    			intro:{
    				content:'手牌上限-1直到下一回合结束'
    			},
    			mod:{
    				maxHandcard:function(player,num){
    					return num-1;
    				}
    			}
    		},
			gw_birinongwu:{
				mark:true,
				nopop:true,
	            intro:{
	                content:'不能使用杀直到下一回合结束'
	            },
	            mod:{
	                cardEnabled:function(card){
	                    if(card.name=='sha') return false;
	                }
	            }
			},
			gw_ciguhanshuang:{
				trigger:{player:'phaseDrawBegin'},
    			forced:true,
    			mark:true,
				nopop:true,
    			intro:{
    				content:'下个摸牌阶段摸牌数-1'
    			},
    			filter:function(event){
    				return event.num>0;
    			},
    			content:function(){
    				trigger.num--;
    				player.removeSkill('gw_ciguhanshuang');
    			}
			},
			gw_dieyi:{
				init:function(player){
					player.storage.gw_dieyi=1;
				},
				onremove:true,
				trigger:{global:'phaseEnd'},
				forced:true,
				mark:true,
				process:function(player){
					if(player.hasSkill('gw_dieyi')){
						player.storage.gw_dieyi++;
					}
					else{
						player.addSkill('gw_dieyi');
					}
					player.syncStorage('gw_dieyi');
					player.updateMarks();
				},
				intro:{
					content:'在当前回合的结束阶段，你随机弃置#张牌'
				},
				content:function(){
					player.randomDiscard(player.storage.gw_dieyi);
					player.removeSkill('gw_dieyi');
				}
			},
			gw_leizhoushu:{
				mark:true,
				intro:{
					content:function(storage,player){
						if(storage>=2){
							return '锁定技，准备阶段，你令手牌数为全场最多的所有其他角色各随机弃置一张手牌，若目标不包含敌方角色，将一名随机敌方角色追加为额外目标，结算X次（重复'+storage+'次）';
						}
						else{
							return '锁定技，准备阶段，你令手牌数为全场最多的所有其他角色各随机弃置一张手牌，若目标不包含敌方角色，将一名随机敌方角色追加为额外目标，结算X次';
						}
					}
				},
				nopop:true,
				trigger:{player:'phaseBegin'},
				forced:true,
				filter:function(event,player){
					var list=game.filterPlayer();
					for(var i=0;i<list.length;i++){
						if(list[i]!=player&&list[i].isMaxHandcard()) return true;
					}
					return false;
				},
				content:function(){
					'step 0'
					if(typeof player.storage.gw_leizhoushu=='number'){
						event.num=player.storage.gw_leizhoushu;
					}
					else{
						event.num=1;
					}
					'step 1'
					if(event.num){
						var max=0;
						var maxp=null;
						var list=game.filterPlayer(function(current){
							return current.isMaxHandcard();
						}).sortBySeat();
						var enemies=player.getEnemies();
						for(var i=0;i<enemies.length;i++){
							if(list.contains(enemies[i])){
								break;
							}
						}
						if(i==enemies.length){
							list.push(enemies.randomGet());
						}
						list.remove(player);
						if(!list.length){
							event.finish();
							return;
						}
						player.line(list,'green');
						for(var i=0;i<list.length;i++){
							list[i].randomDiscard('h',false);
						}
					}
					else{
						event.finish();
					}
					'step 2'
					event.num--;
					event.goto(1);
					game.delay();
				}
			},
			_gainspell:{
				trigger:{player:'drawBegin'},
				silent:true,
				priority:-11,
				filter:function(event,player){
					if(_status.connectMode) return false;
					if(!lib.config.cards.contains('gwent')) return false;
					if(game.fixedPile) return false;
					return event.num>0&&event.parent.name=='phaseDraw';
				},
				content:function(){
					if(!player.storage.spell_gain||Math.max.apply(null,player.storage.spell_gain)<0){
						var tmp=player.storage.spell_gain2;
						player.storage.spell_gain=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].randomGets(3);
						player.storage.spell_gain2=Math.floor((15-Math.max.apply(null,player.storage.spell_gain))/2);
						if(tmp){
							for(var i=0;i<3;i++){
								player.storage.spell_gain[i]+=tmp;
							}
						}
					}
					for(var i=0;i<3;i++){
						if(player.storage.spell_gain[i]==0){
							var list;
							if(i==0){
								list=get.libCard(function(info){
									return info.subtype=='spell_gold';
								});
								if(get.mode()=='stone'){
									list.remove('gw_aerdeyin');
								}
							}
							else{
								list=get.libCard(function(info){
									return info.subtype=='spell_silver';
								});
							}
							if(list&&list.length){
								ui.cardPile.insertBefore(game.createCard(list.randomGet()),ui.cardPile.firstChild);
							}
						}
						player.storage.spell_gain[i]--;
					}
				}
			}
		},
		help:{
			'昆特牌':'<ul><li>法术为分金、银、铜三类，金卡和银卡不出现在牌堆中<li>'+
			'摸牌阶段有一定概率摸到银卡，在16个摸牌阶段中至少会摸到2张银卡<li>'+
			'摸牌阶段有一定概率摸到金卡，在16个摸牌阶段中至少会摸到1张金卡<li>'+
			'金卡无视调虎离山、潜行等免疫目标的效果<li>'+
			'进行洗牌时金卡、银卡将从弃牌堆中消失，不进入牌堆'
		},
		translate:{
			spell:'法术',
			spell_gold:'金卡法术',
			spell_silver:'银卡法术',
			spell_bronze:'铜卡法术',
			gw_dieyi:'蝶翼',
			gw_dieyi_equip1:'蝶翼·器',
			gw_dieyi_equip2:'蝶翼·衣',
			gw_dieyi_equip3:'蝶翼·攻',
			gw_dieyi_equip4:'蝶翼·防',
			gw_dieyi_equip5:'蝶翼·宝',
			gw_dieyi_judge:'蝶翼·判',
			gw_dieyi_equip1_info:'在你从装备区中失去此牌后，你于当前回合的结束阶段段随机弃置一张牌',
			gw_dieyi_equip2_info:'在你从装备区中失去此牌后，你于当前回合的结束阶段段随机弃置一张牌',
			gw_dieyi_equip3_info:'在你从装备区中失去此牌后，你于当前回合的结束阶段段随机弃置一张牌',
			gw_dieyi_equip4_info:'在你从装备区中失去此牌后，你于当前回合的结束阶段段随机弃置一张牌',
			gw_dieyi_equip5_info:'在你从装备区中失去此牌后，你于当前回合的结束阶段段随机弃置一张牌',
			gw_dieyi_judge_info:'判定阶段移去此牌，并于当前回合的结束阶段随机弃置一张牌',
			gw_hudiewu:'蝴蝶舞',
			gw_hudiewu_info:'将其他角色在场上的所有牌替换为蝶翼（在你失去蝶翼后，你于当前回合的结束阶段随机弃置一张牌），然后结束出牌阶段',
			gw_yigeniyin:'伊格尼印',
			gw_yigeniyin_info:'对敌方角色中体力值最大的一名随机角色造成一点火焰伤害，然后对场上体力值最大的所有角色各造成一点火焰伤害，然后结束出牌阶段',
			gw_leizhoushu:'雷咒术',
			gw_leizhoushu_info:'获得技能雷咒术（在每个准备阶段令全场牌数最多的所有其他角色各随机弃置一张牌，若目标不包含敌方角色，将一名随机敌方角色追加为额外目标，结算X次，X为本局获得此技能的次数），然后结束出牌阶段',
			gw_aerdeyin:'阿尔德印',
			gw_aerdeyin_info:'对相邻的角色造成一点伤害，目标摸一张牌并移出游戏一轮，然后结束出牌阶段',
			gw_xinsheng:'新生',
			gw_xinsheng_info:'随机观看12张武将牌，选择一张替代一名角色的武将牌，然后结束出牌阶段',
			gw_zhongmozhizhan:'终末之战',
			gw_zhongmozhizhan_info:'将所有角色区域内的所有牌置入弃牌堆（不触发技能），然后结束出牌阶段',
			gw_butianshu:'卜天术',
			gw_butianshu_info:'出牌阶段对任意角色使用，将任意一张延时锦囊牌置入其判定区',
			gw_zhihuanjun:'致幻菌',
			gw_zhihuanjun_info:'出牌阶段对一名已受伤角色使用，令其减少一点体力上限',
			gw_niuquzhijing:'纽曲之镜',
			gw_niuquzhijing_info:'令全场体力最多的角色减少一点体力和体力上限，体力最少的角色增加一点体力和体力上限（不触发技能），然后结束出牌阶段',
			gw_ansha:'暗杀',
			gw_ansha_info:'令一名体力为1的随机敌方角立即死亡，然后结束出牌阶段',
			gw_shizizhaohuan:'十字召唤',
			gw_shizizhaohuan_info:'从牌堆中获得一张杀以及决斗、火攻、火烧连营、南蛮入侵四张牌中的随机一张',
			gw_zuihouyuanwang:'最后愿望',
			gw_zuihouyuanwang_info:'摸X张牌并弃置X张牌，X为存活角色数',
			gw_zirankuizeng:'自然馈赠',
			gw_zirankuizeng_info:'选择任意一张铜卡法术使用',
			gw_poxiao:'破晓',
			gw_poxiao_info:'选择一项：弃置一名角色判定区内的所有牌，或随机获得一张铜卡法术（破晓除外）并展示之',
			gw_zumoshoukao:'阻魔手铐',
			gw_zumoshoukao_info:'令一名角色失去所有护甲且非锁定技失效直到下一回合结束',
			gw_aozuzhilei:'奥祖之雷',
			gw_aozuzhilei_info:'对一名体力值不小于你的角色造成一点雷属性伤害，然后该角色摸一张牌',
			gw_zhuoshao:'灼烧',
			gw_zhuoshao_info:'对任意名体力值为全场最高的角色使用，造成一点火属性伤害',
			gw_fuyuan:'复原',
			gw_fuyuan_info:'对一名濒死状态角色使用，目标回复一点体力并获得一点护甲',
			gw_youer:'诱饵',
			gw_youer_bg:'饵',
			gw_youer_info:'将一名其他角色的所有手牌移出游戏，然后摸一张牌，当前回合结束后该角色将以此法失去的牌收回手牌',
			gw_tongdi:'通敌',
			gw_tongdi_info:'交给一名角色一张手牌，然后观看其手牌并获得其中两张',
			gw_baoxueyaoshui:'暴雪药水',
			gw_baoxueyaoshui_info:'令一名角色弃置两张手牌并摸一张牌',
			gw_birinongwu:'蔽日浓雾',
			gw_birinongwu_bg:'雾',
			gw_birinongwu_info:'出牌阶段对一名角色及其相邻角色使用，目标不能使用杀直到下一回合结束',
			gw_qinpendayu:'倾盆大雨',
			gw_qinpendayu_bg:'雨',
			gw_qinpendayu_info:'出牌阶段对一名角色及其相邻角色使用，目标手牌上限-1直到下一回合结束',
			gw_ciguhanshuang:'刺骨寒霜',
			gw_ciguhanshuang_bg:'霜',
			gw_ciguhanshuang_info:'出牌阶段对一名角色及其相邻角色使用，目标下个摸牌阶段摸牌数-1',
			gw_wenyi:'瘟疫',
			gw_wenyi_info:'令所有体力值为全场最少的角色随机弃置一张牌',
			gw_yanziyaoshui:'燕子药水',
			gw_yanziyaoshui_info:'令一名角色摸一张牌，若其手牌数为全场最少，改为摸三张',
			gw_guaiwuchaoxue:'怪物巢穴',
			gw_guaiwuchaoxue_info:'选择手牌中的一张杀、闪或酒，获得两张该牌的复制',
			gw_shanbengshu:'山崩术',
			gw_shanbengshu_info:'所有角色随机弃置一张牌',
		},
		cardType:{
			spell:0.5,
			spell_bronze:0.2,
			spell_silver:0.3,
			spell_gold:0.4
		},
		list:[
			['club',3,'gw_zhihuanjun'],
			['spade',2,'gw_zhihuanjun'],

			['heart',7,'gw_poxiao'],
			['diamond',4,'gw_poxiao'],

			['spade',9,'gw_aozuzhilei','thunder'],
			['club',7,'gw_aozuzhilei','thunder'],

			['club',1,'gw_zumoshoukao'],
			['spade',1,'gw_zumoshoukao'],

			['diamond',5,'gw_qinpendayu'],
			['club',7,'gw_qinpendayu'],

			['spade',9,'gw_birinongwu'],
			['heart',13,'gw_birinongwu'],

			['diamond',11,'gw_ciguhanshuang'],
			['club',7,'gw_ciguhanshuang'],

			['heart',4,'gw_baoxueyaoshui'],
			['spade',8,'gw_baoxueyaoshui'],
		],
	};
});
