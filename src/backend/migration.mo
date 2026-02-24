import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Array "mo:core/Array";

module {
  type ScienceNote = {
    chapterNumber : Nat;
    chapterTitle : Text;
    content : Text;
    importantPoints : [Text];
    definitions : [Text];
    examples : [Text];
  };

  type GameState = {
    currentLevel : Nat;
    unlockedPuzzles : [Text];
    timeTaken : Int;
    score : Nat;
  };

  type HighScore = {
    player : Text;
    level : Nat;
    timeTaken : Int;
    score : Nat;
  };

  type OldActor = {
    notes : Map.Map<Nat, ScienceNote>;
    nextId : Nat;
  };

  type NewActor = {
    notes : Map.Map<Nat, ScienceNote>;
    nextId : Nat;
    gameStates : Map.Map<Text, GameState>;
    highScores : Map.Map<Text, List.List<HighScore>>;
  };

  public func run(old : OldActor) : NewActor {
    let gameStates = Map.empty<Text, GameState>();
    let highScores = Map.empty<Text, List.List<HighScore>>();
    {
      old with gameStates;
      highScores;
    };
  };
};
