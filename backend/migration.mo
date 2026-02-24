import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Nat "mo:core/Nat";

module {
  type OldGameType = {
    #cardMatching;
    #slidingPuzzle;
    #patternMemory;
    #sequenceMemory;
    #stroopEffect;
  };

  type OldHighScore = {
    player : Text;
    gameType : OldGameType;
    level : Nat;
    timeTaken : Int;
    score : Nat;
  };

  type OldGameState = {
    gameType : OldGameType;
    currentLevel : Nat;
    unlockedPuzzles : [Text];
    timeTaken : Int;
    score : Nat;
  };

  type OldActor = {
    highScores : Map.Map<Text, List.List<OldHighScore>>;
    gameStates : Map.Map<Text, OldGameState>;
  };

  type NewGameType = {
    #cardMatching;
    #slidingPuzzle;
    #patternMemory;
    #sequenceMemory;
    #stroopEffect;
    #memoryTest;
  };

  type NewHighScore = {
    player : Text;
    gameType : NewGameType;
    level : Nat;
    timeTaken : Int;
    score : Nat;
  };

  type NewMemoryTestState = {
    currentLevel : Nat;
    correctAnswers : Nat;
    streak : Nat;
    hintsRemaining : Nat;
    timeTaken : Int;
    gameOver : Bool;
  };

  type NewMemoryTestHighScore = {
    player : Text;
    level : Nat;
    correctAnswers : Nat;
    streak : Nat;
    timeTaken : Int;
    score : Nat;
    date : Int;
  };

  type OptionalNewMemoryTestState = ?NewMemoryTestState;
  type OptionalNewMemoryTestHighScoresArray = ?[NewMemoryTestHighScore];

  type NewGameState = {
    gameType : NewGameType;
    currentLevel : Nat;
    unlockedPuzzles : [Text];
    timeTaken : Int;
    score : Nat;
    memoryTestState : OptionalNewMemoryTestState;
    memoryTestRecords : OptionalNewMemoryTestHighScoresArray;
  };

  type NewActor = {
    highScores : Map.Map<Text, List.List<NewHighScore>>;
    gameStates : Map.Map<Text, NewGameState>;
    memoryTestHighScores : List.List<NewMemoryTestHighScore>;
  };

  func convertGameType(old : OldGameType) : NewGameType {
    switch (old) {
      case (#cardMatching) { #cardMatching };
      case (#slidingPuzzle) { #slidingPuzzle };
      case (#patternMemory) { #patternMemory };
      case (#sequenceMemory) { #sequenceMemory };
      case (#stroopEffect) { #stroopEffect };
    };
  };

  func convertHighScore(old : OldHighScore) : NewHighScore {
    {
      old with gameType = convertGameType(old.gameType);
    };
  };

  func convertGameState(old : OldGameState) : NewGameState {
    {
      old with
      gameType = convertGameType(old.gameType);
      memoryTestState = null;
      memoryTestRecords = null;
    };
  };

  func convertHighScores(oldMap : Map.Map<Text, List.List<OldHighScore>>) : Map.Map<Text, List.List<NewHighScore>> {
    oldMap.map<Text, List.List<OldHighScore>, List.List<NewHighScore>>(
      func(_key, oldList) {
        oldList.map<OldHighScore, NewHighScore>(convertHighScore);
      }
    );
  };

  func convertGameStates(oldMap : Map.Map<Text, OldGameState>) : Map.Map<Text, NewGameState> {
    oldMap.map<Text, OldGameState, NewGameState>(
      func(_key, oldState) { convertGameState(oldState) }
    );
  };

  func convertMemoryTestHighScores(old : List.List<NewMemoryTestHighScore>) : List.List<NewMemoryTestHighScore> {
    old;
  };

  public func run(old : OldActor) : NewActor {
    {
      highScores = convertHighScores(old.highScores);
      gameStates = convertGameStates(old.gameStates);
      memoryTestHighScores = List.empty<NewMemoryTestHighScore>();
    };
  };
};
