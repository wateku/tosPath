
var TeamManager = function( table, environment ){
    var CharacterInfo = function(characterID, xIndex){
        var self = this;
        this.id      = characterID;
        this.color   = CHARACTERS_DATA[characterID].color;
        this.type    = CHARACTERS_DATA[characterID].type;
        this.leader  = CHARACTERS_DATA[characterID].leader;
        this.wake    = CHARACTERS_DATA[characterID].wake;
        this.wakeVar = CHARACTERS_DATA[characterID].wake_var;

        this.xIndex  = xIndex;
    }
    var LeaderSkillInfo = function(skillID){
        var self = this;
        this.variable		= null;
        this.id				= skillID;
        this.init			= LEADER_SKILLS_DATA[skillID].init;
        this.newItem		= LEADER_SKILLS_DATA[skillID].newItem;
        this.randNewItem	= LEADER_SKILLS_DATA[skillID].randNewItem;
        this.locus			= LEADER_SKILLS_DATA[skillID].locus;
    }
    var WakeSkillInfo = function(wakeID){
        var self = this;
        this.id       = wakeID;
        this.init     = WAKES_DATA[wakeID].init;
    }
    var TeamSkillInfo = function(teamID){
        var self = this;
        this.variable		= null;
        this.id          = teamID;
        this.init        = TEAM_SKILLS_DATA[teamID].init;
        this.newItem     = TEAM_SKILLS_DATA[teamID].newItem;
        this.randNewItem = TEAM_SKILLS_DATA[teamID].randNewItem;
        this.newDelete   = TEAM_SKILLS_DATA[teamID].newDelete;
        this.breakColor  = TEAM_SKILLS_DATA[teamID].breakColor;
		this.locus       = TEAM_SKILLS_DATA[teamID].locus;
    }

	var self = this;

	this.table = table;
    this.environment = environment;

    this.team    = null;
	this.leader  = null;
	this.friend  = null;

    this.leaderSkill = null;
    this.friendSkill = null;
    this.teamSkills = new Array();

    this.leaderWake  = null;
    this.friendWake  = null;

	this.initialize = function(){
        self.table.find("select").each(function(){
            //清空
            var dropdown = $(this).msDropdown().data("dd");
            dropdown.destroy();
            $(this).children().remove();
            $(this).css("width", BALL_SIZE*1.1+"px");

            //重建
            for(var id in CHARACTERS_DATA){
                var option = $("<option></option>");
                option.attr("value", CHARACTERS_DATA[id]["id"]);
                option.attr("data-image", CHARACTERS_DATA[id]["img"]);
                $(this).append(option);
            }
            dropdown = $(this).msDropdown( {
                byJson: { selectedIndex: 0, },
                visibleRows: 4,
                rowHeight: BALL_SIZE,
                openDirection: "alwaysDown",
                zIndex: 9999,
            } ).data("dd");
        });		
	};
    this.toText = function(){
        var text = new Array();
        text.push( $("#LeaderMember").val() );
        text.push( $("#FriendMember").val() );
        return text.join(",");
    }
    this.setTeamFromText = function( text ){
        var teamIDs = text.split(",");
        for(var i = 0; i < teamIDs.length; i++){
            var dd = self.table.find("select").eq(i).msDropdown().data("dd");
            dd.setIndexByValue( teamIDs[i] );
        }
    }

    this.setTeamAbility = function(){
        self.setTeamMember();
        
        self.setMemberWakeSkill();
        self.setTeamSkill();

        self.setMemberLeaderSkill();
    };
    // 設定隊伍 初始技能
    this.setTeamMember = function(){
        self.leader  = new CharacterInfo( $("#LeaderMember").val(), 0 );
        self.friend  = new CharacterInfo( $("#FriendMember").val(), 5 );
        self.team    = [ self.leader, self.friend ];
    }
    this.setMemberLeaderSkill = function(){
        self.leaderSkill = new LeaderSkillInfo( self.leader.leader );
        self.leaderSkill.variable = new self.leaderSkill.init( self.leader );
        self.friendSkill = new LeaderSkillInfo( self.friend.leader );
        self.friendSkill.variable = new self.friendSkill.init( self.friend );
    };
    this.setMemberWakeSkill = function(){
        self.leaderWake  = new Array();
        for(var i = 0; i < self.leader.wake.length; i++){
            var wake = new WakeSkillInfo( self.leader.wake[i] );
            wake.init( self.leader, self.leader.wakeVar[i] );
            self.leaderWake.push( wake );
        }
        self.friendWake  = new Array();
        for(var i = 0; i < self.friend.wake.length; i++){
            var wake = new WakeSkillInfo( self.friend.wake[i] );
            wake.init( self.friend, self.friend.wakeVar[i] );
            self.friendWake.push( wake );
        }
    }
    this.setTeamSkill = function(){
        self.teamSkills = new Array();
        var skills = TEAM_SKILLS_DATA.findTeamSkills(self.leader, self.friend);
        for(var i =0; i < skills.length; i++){
            var skill = new TeamSkillInfo(skills[i]);
            skill.variable = new skill.init();
            self.teamSkills.push( skill );
        }
    };

    this.checkLeaderSkill = function( key ){
        if( self.leaderSkill && self.leaderSkill[key] ){
            self.leaderSkill[key]( self.leader, "LEADER" );
        }
        if( self.friendSkill && self.friendSkill[key] ){
            self.friendSkill[key]( self.friend, "FRIEND" );
        }
    }
    this.checkTeamSkill = function( key ){ 
		var paraments = Array.prototype.slice.call(arguments);
		paraments.shift();
        for(var i = 0; i < self.teamSkills.length; i++){
            if( self.teamSkills[i][key] ){
                self.teamSkills[i][key]( self.leader, self.friend, paraments );
            }
        }
    }
};
