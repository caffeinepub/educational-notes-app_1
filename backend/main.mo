import Map "mo:core/Map";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Order "mo:core/Order";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";



actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type Analytics = {
    totalVisitors : Nat;
    totalSessions : Nat;
    gamePlayCounts : Map.Map<Text, Nat>;
  };

  type AnalyticsView = {
    totalVisitors : Nat;
    totalSessions : Nat;
    gamePlayCounts : [(Text, Nat)];
  };

  let gamePlayCounts = Map.empty<Text, Nat>();
  var totalVisitors = 0;
  var totalSessions = 0;

  type UserProfile = {
    name : Text;
    avatarUrl : ?Text;
  };

  type ScienceNote = {
    chapterNumber : Nat;
    chapterTitle : Text;
    content : Text;
    importantPoints : [Text];
    definitions : [Text];
    examples : [Text];
  };

  type GameType = {
    #cardMatching;
    #slidingPuzzle;
    #patternMemory;
    #sequenceMemory;
    #stroopEffect;
    #memoryTest;
  };

  type MemoryTestState = {
    currentLevel : Nat;
    correctAnswers : Nat;
    streak : Nat;
    hintsRemaining : Nat;
    timeTaken : Int;
    gameOver : Bool;
  };

  type MemoryTestHighScore = {
    player : Text;
    level : Nat;
    correctAnswers : Nat;
    streak : Nat;
    timeTaken : Int;
    score : Nat;
    date : Int;
  };

  type GameState = {
    gameType : GameType;
    currentLevel : Nat;
    unlockedPuzzles : [Text];
    timeTaken : Int;
    score : Nat;
    memoryTestState : ?MemoryTestState;
    memoryTestRecords : ?[MemoryTestHighScore];
  };

  type HighScore = {
    player : Text;
    gameType : GameType;
    level : Nat;
    timeTaken : Int;
    score : Nat;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let notes = Map.empty<Nat, ScienceNote>();
  var nextId = 1;
  let gameStates = Map.empty<Text, GameState>();
  let highScores = Map.empty<Text, List.List<HighScore>>();
  let memoryTestHighScores = List.empty<MemoryTestHighScore>();

  // Analytics functions
  public shared ({ caller }) func recordVisit() : async () {
    totalVisitors += 1;
    totalSessions += 1;
  };

  public shared ({ caller }) func recordGamePlay(gameName : Text) : async () {
    switch (gamePlayCounts.get(gameName)) {
      case (null) {
        gamePlayCounts.add(gameName, 1);
      };
      case (?count) {
        let newCount = count + 1;
        gamePlayCounts.add(gameName, newCount);
      };
    };
  };

  public shared ({ caller }) func getAnalytics(password : Text) : async ?AnalyticsView {
    if (password != "#vansh@g1admin@81") { return null };

    let playCountsArray = gamePlayCounts.toArray();

    ?{
      totalVisitors;
      totalSessions;
      gamePlayCounts = playCountsArray;
    };
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get their profile");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Admin: Initialize Chapters
  public shared ({ caller }) func initializeChapters() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can initialize chapters");
    };

    notes.clear();
    nextId := 1;

    let newChapters = [
      {
        chapterNumber = 1;
        chapterTitle = "पौधे (Plants)";
        content = "पौधों के विकास, उनके भाग, और जीवन चक्र के बारे में संपूर्ण जानकारी। इसमें पौधों की वृद्धि, स्टेम, रूट, लीफ और उनके कार्य को विस्तार से बताया गया है।";
        importantPoints = [
          "पौधों के हिस्से: जड़, तना, पत्ती, फूल, फल",
          "फोटोसिंथेसिस प्रक्रिया",
          "पानी और पोषक तत्वों का ट्रांसपोर्टेशन",
        ];
        definitions = [
          "फोटोसिंथेसिस: वह प्रक्रिया जिसमें पौधे सूर्य के प्रकाश से आहार बनाते हैं",
          "स्टेम: पौधे का हिस्सा जो जल और पोषक तत्व पहुंचाता है",
        ];
        examples = [
          "पत्तियों में फोटोसिंथेसिस होता है",
          "शाखाएँ पौधे को सपोर्ट करती हैं",
        ];
      },
      {
        chapterNumber = 2;
        chapterTitle = "शारीरिक गतियाँ (Body Movements)";
        content = "मानव शरीर की हड्डियाँ, मांसपेशियाँ, और विभिन्न अंगों की गतियाँ। हड्डियों की संरचना, मांसपेशियों के प्रकार, और खेल संबंधित चर्चा।";
        importantPoints = [
          "हड्डियाँ शरीर को संरचना देती हैं",
          "जोड़ों के प्रकार: बॉल और सॉकेट, हिंग",
          "मांसपेशियाँ गति में मदद करती हैं",
        ];
        definitions = [
          "हड्डियाँ: ताकतवर संरचना जो शरीर को आकार देती हैं",
          "जोड़: हड्डियों को जोड़ने वाली संरचना",
        ];
        examples = [
          "घुटना हिंग जोड़ का उदाहरण है",
          "कंधे बॉल और सॉकेट जोड़ हैं",
        ];
      },
      {
        chapterNumber = 3;
        chapterTitle = "प्रकाश, छाया और परावर्तन (Light, Shadows & Reflections)";
        content = "प्रकाश के स्त्रोत, छाया का निर्माण, और परावर्तन की प्रक्रिया। इसके मुख्य नियमों एवं उपयोग के उदाहरण।";
        importantPoints = [
          "प्रकाश सीधी रेखा में चलता है",
          "अंधकार में छाया नहीं बनती",
          "परावर्तन: प्रकाश का दिशा बदलना",
        ];
        definitions = [
          "प्रकाश स्त्रोत: प्रकाश उत्पन्न करने वाली वस्तु",
          "छाया: प्रकाश अवरुद्ध होने से बनती है",
        ];
        examples = [
          "दर्पण में स्पष्ट परावर्तन होता है",
          "सूरज से सबसे तेज प्रकाश मिलता है",
        ];
      },
      {
        chapterNumber = 4;
        chapterTitle = "बिजली और सर्किट (Electricity & Circuits)";
        content = "बिजली के मुख्य सिद्धांत, सर्किट के आवश्यक तत्व, और किस प्रकार बिजली उपकरणों को चलाती है। कंडक्टर और इंसुलेटर का अध्ययन।";
        importantPoints = [
          "सर्किट: बिजली का प्रवाह",
          "कंडक्टर, इंसुलेटर की पहचान",
          "सुरक्षा और सावधानियाँ",
        ];
        definitions = [
          "सर्किट: बिजली प्रवाहित करने वाला पथ",
          "कंडक्टर: बिजली प्रवाहित करने वाली सामग्री",
        ];
        examples = [
          "तार कंडक्टर हैं, प्लास्टिक इंसुलेटर है",
          "बिजली उपकरण सर्किट से चलते हैं",
        ];
      },
    ];

    for (chapter in newChapters.values()) {
      notes.add(nextId, chapter);
      nextId += 1;
    };
  };

  // Chapter Queries - public, no auth needed
  public query func getChapter(chapterNumber : Nat) : async ?ScienceNote {
    notes.get(chapterNumber);
  };

  public query func getAllChapters() : async [ScienceNote] {
    notes.values().toArray();
  };

  // Game State Management
  public shared func startTimer() : async Int {
    Time.now();
  };

  public shared ({ caller }) func completeLevel(player : Text, gameType : GameType, level : Nat, startTime : Int, correctAnswers : Nat, totalQuestions : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can complete levels");
    };

    let endTime : Int = Time.now();
    let timeTaken = endTime - startTime;

    let score = calculateScore(timeTaken, correctAnswers, totalQuestions);

    let unlockedPuzzles = updateUnlockedPuzzles(player, level);

    let newState : GameState = {
      gameType;
      currentLevel = level;
      unlockedPuzzles;
      timeTaken;
      score;
      memoryTestState = null;
      memoryTestRecords = null;
    };

    gameStates.add(player, newState);
    updateHighScores(player, gameType, level, timeTaken, score);
  };

  func calculateScore(timeTaken : Int, correctAnswers : Nat, totalQuestions : Nat) : Nat {
    let timeScore = if (timeTaken < 600000_000_000) { 100 }
    else if (timeTaken < 1200000_000_000) { 60 } else {
      30;
    };
    let accuracyScore = (correctAnswers * 100) / totalQuestions;
    (
      if (totalQuestions > 0) {
        ((timeScore + accuracyScore) / 2) * ((totalQuestions * 100) / 50);
      } else {
        0;
      }
    );
  };

  func updateUnlockedPuzzles(player : Text, level : Nat) : [Text] {
    let basePuzzles = ["Quiz 1", "Math Worksheet 1"];
    if (level == 2) { basePuzzles.concat(["Puzzle 2"]) } else if (level == 3) {
      basePuzzles.concat(["Puzzle 2", "Puzzle 3"]);
    } else if (level == 4) {
      basePuzzles.concat(["Puzzle 2", "Puzzle 3", "Puzzle 4"]);
    } else { basePuzzles };
  };

  func compare(scoresA : HighScore, scoresB : HighScore) : Order.Order {
    if (scoresA.score > scoresB.score) { #less }
    else if (scoresA.score < scoresB.score) { #greater }
    else {
      if (scoresA.timeTaken < scoresB.timeTaken) { #less } else {
        #equal;
      };
    };
  };

  func updateHighScores(player : Text, gameType : GameType, level : Nat, timeTaken : Int, score : Nat) {
    let newScore : HighScore = {
      player;
      gameType;
      level;
      timeTaken;
      score;
    };

    switch (highScores.get(player)) {
      case (null) {
        let newHighScoreList = List.empty<HighScore>();
        newHighScoreList.add(newScore);
        highScores.add(player, newHighScoreList);
      };
      case (?playerScores) {
        if (playerScores.size() >= 10) {
          let currentHighScores = playerScores.toArray();
          let minScore = currentHighScores.foldLeft(currentHighScores[0].score, func(acc, hs) { if (hs.score < acc) { hs.score } else {
            acc;
          } });
          let maxTime = currentHighScores.foldLeft(currentHighScores[0].timeTaken, func(acc, hs) { if (hs.timeTaken > acc) { hs.timeTaken } else {
            acc;
          } });

          if ((score == minScore and timeTaken < maxTime) or score > minScore) {
            let filteredScores = List.empty<HighScore>();
            var count = 0;
            for (scoreIter in currentHighScores.values()) {
              if (count < 9) { filteredScores.add(scoreIter) } else {
                ();
              };
              count += 1;
            };
            filteredScores.add(newScore);
            let sortedScores = filteredScores.toArray();
            playerScores.clear();
            for (score in sortedScores.values()) {
              playerScores.add(score);
            };
            highScores.add(player, playerScores);
          };
        } else {
          playerScores.add(newScore);
        };
      };
    };
  };

  public shared ({ caller }) func completeMemoryTest(player : Text, level : Nat, correctAnswers : Nat, streak : Nat, hintsUsed : Nat, timeTaken : Int, score : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can complete memory tests");
    };

    let memoryTestScore = {
      player;
      level;
      correctAnswers;
      streak;
      timeTaken;
      score;
      date = Time.now();
    };

    let newMemoryTestHighScores = List.empty<MemoryTestHighScore>();
    for (s in memoryTestHighScores.values()) {
      newMemoryTestHighScores.add(s);
    };
    newMemoryTestHighScores.add(memoryTestScore);
    memoryTestHighScores.clear();
    for (s in newMemoryTestHighScores.values()) {
      memoryTestHighScores.add(s);
    };

    let existingScoreIndex = newMemoryTestHighScores.toArray().findIndex(func(s) { s.player == player and s.level == level });

    let persistentHighScores = List.empty<MemoryTestHighScore>();

    switch (existingScoreIndex) {
      case (null) {
        persistentHighScores.add(memoryTestScore);
      };
      case (?index) {
        let highScoreArray = persistentHighScores.toArray();
        persistentHighScores.clear();
        var i = 0;
        while (i < highScoreArray.size()) {
          if (i == index) {
            persistentHighScores.add(memoryTestScore);
          } else {
            persistentHighScores.add(highScoreArray[i]);
          };
          i += 1;
        };
      };
    };

    persistentHighScores.add(memoryTestScore);

    let memoryTestState : MemoryTestState = {
      currentLevel = level;
      correctAnswers;
      streak;
      hintsRemaining = 5 - hintsUsed;
      timeTaken;
      gameOver = false;
    };

    let newGameState : GameState = {
      gameType = #memoryTest;
      currentLevel = level;
      unlockedPuzzles = [];
      timeTaken;
      score;
      memoryTestState = ?memoryTestState;
      memoryTestRecords = ?newMemoryTestHighScores.toArray();
    };

    gameStates.add(player, newGameState);

    true;
  };

  // Queries - public reads, no auth needed
  public query func getPlayerGameState(player : Text) : async ?GameState {
    gameStates.get(player);
  };

  public query func getPlayerHighScores(player : Text) : async [HighScore] {
    switch (highScores.get(player)) {
      case (null) { [] };
      case (?highScoreList) { highScoreList.toArray() };
    };
  };

  public query func getMemoryTestHighScores() : async [MemoryTestHighScore] {
    memoryTestHighScores.toArray();
  };
};
