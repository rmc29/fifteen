gridsize = 4;
numberoftiles = gridsize*gridsize;
maxmoves=1000;
delay=1;
moveincrement=1;
numberofincrements=70;
tileoffset=moveincrement*numberofincrements;
movetileid=-1;
drow=0;
dcol=0;
tilepos = new Array(numberoftiles,2);
content = new Array(numberoftiles);
movestaken=0;


function shuffle()
{
	
	var numberofmoves = Math.floor(Math.random()*maxmoves);
	for (i=1;i<numberofmoves;i++) 
	{
		permitteddirection='';			//(blank tile moves) up, down, left, right
		permitteddirection+= (tilepos[0][0]==0 ? '' : 'u');
		permitteddirection+= (tilepos[0][0]==(gridsize-1)*tileoffset ? '' : 'd');
		permitteddirection+= (tilepos[0][1]==0 ? '' : 'l');
		permitteddirection+= (tilepos[0][1]==(gridsize-1)*tileoffset ? '' : 'r');
		direction=permitteddirection.substr(Math.floor(Math.random()*permitteddirection.length),1);
		//extract a letter from the string with equal probability
		
		blanklocation = (tilepos[0][0]*gridsize/tileoffset) + (tilepos[0][1]/tileoffset);
		
		switch (direction) {
			case 'u':
				swapposition=blanklocation-gridsize;
				break;
			case 'd':
				swapposition=blanklocation+gridsize;
				break;
			case 'l':
				swapposition=blanklocation-1;
				break;
			case 'r':
				swapposition=blanklocation+1;
				break;
		}
		swaptile=content[swapposition];
		temprow=tilepos[swaptile][0] ;
		tempcol=tilepos[swaptile][1] ;
		tilepos[swaptile]=tilepos[0]		//'move' it where the blank was
		tilepos[0]=[temprow, tempcol]; 	//'move' blank into its old pos
		
		content[blanklocation] = swaptile;
		content[swapposition] = 0;
		
	}
}


function createdisplay()
{
for (i=1;i<numberoftiles;i++)
	{
		document.getElementById("board").innerHTML +=('<div class="tile" id="' + i + '" onclick="clicktile(' + i + ', movetileid)"><span class="number">' +  i +'</span></div>');
		drawtile(i, tilepos[i][0], tilepos[i][1]);		
	}
}


function clicktile(tileid, old)
{
	//if a tile is moving, it should go straight to its destination
	if(old!=-1)
	{
		
		tilepos[old][0]=tilepos[0][0] + (drow*numberofincrements);
		tilepos[old][1]=tilepos[0][1] + (dcol*numberofincrements);
		//its destination is given by fully incrementing current position of blank, as that hasn't moved again yet
		drawtile(old, tilepos[0][0] + (drow*numberofincrements), tilepos[0][1] + (dcol*numberofincrements));
	}
	
	document.getElementById('message').style.visibility='hidden';
	
	var rowdiff = Math.abs(tilepos[tileid][0]-tilepos[0][0]);
	var coldiff = Math.abs(tilepos[tileid][1]-tilepos[0][1]);
	
	if ((rowdiff==tileoffset && coldiff==0) || (rowdiff==0 && coldiff==tileoffset)  )  
	//if it's just above/below the blank, or just left/right of it
	{
		i=1;
		drow = (tilepos[0][0]-tilepos[tileid][0])/numberofincrements;
		dcol = (tilepos[0][1]-tilepos[tileid][1])/numberofincrements;
		temprow=tilepos[tileid][0] ;
		tempcol=tilepos[tileid][1] ;
		tilepos[tileid]=tilepos[0]		//'move' it where the blank was
		tilepos[0]=[temprow, tempcol]; 	//'move' blank into its old pos
		movestaken++;
		document.getElementById('moves').innerHTML=movestaken;
		
		movetileid=tileid;
		movetile();						//actually relocate it in its new pos, where blank was
		
	}
	else
	{
		document.getElementById('message').style.visibility='visible';
	}
}

function movetile()
{
	temprow+=drow;
	tempcol+=dcol;
	drawtile(movetileid, temprow, tempcol)
	i++;
	if (i<=numberofincrements) 	
	{
		setTimeout('movetile()',delay);
	
	} else {
		checkforwin();
	}
}

function drawtile(tileid, row, col)
{
		document.getElementById(''+tileid).style.top=row + 'px';
		document.getElementById(''+tileid).style.left=col + 'px';
}

function checkforwin()
{
	win=true;
	for (j=1;j<numberoftiles;j++)
	{
		if ((tilepos[j][0] != tileoffset*Math.floor((j-1)/gridsize)) || 	(tilepos[j][1] != (tileoffset*(j-1))-(tilepos[j][0]*gridsize)))
		{
			win=false;
			break;
		}
	}
	if(win) alert("Yay, you win!");
}

function main() {

	tilepos[0]=[(gridsize-1)*tileoffset,(gridsize-1)*tileoffset];

	document.getElementById("board").innerHTML += '<div class="blank" id="0"></div>'; //create blank 'tile'

	content[0]=1;

	for (i=1;i<numberoftiles;i++)
	{
		tilepos[i]=[0,0];
		tilepos[i][0]=Math.floor((i-1)/gridsize); //row
		tilepos[i][1]=(i-1-(tilepos[i][0]*gridsize))*tileoffset;
		tilepos[i][0] *= tileoffset;
		content[i] = i+1;
	} 
shuffle();
createdisplay();

}