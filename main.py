from typing import List, Dict

def evaluate_condition(condition: str, layouts: List[Dict[str, int]], aliases: List[Dict[str, str]]):
    alias_dict = {list(item.keys())[0]: list(item.values())[0] for item in aliases}

    condition = condition.replace("not ", "not ").replace(" and ", " and ").replace(" or ", " or ")

    matching_layouts = [layout for layout in layouts if eval(condition, {}, layout)]

    if not matching_layouts:
        print("No layouts match the given condition.")
        return

    objectives = matching_layouts[0].keys()
    certain_spawned = {obj for obj in objectives if all(layout[obj] == 1 for layout in matching_layouts)}
    certain_not_spawned = {obj for obj in objectives if all(layout[obj] == 0 for layout in matching_layouts)}

    certain_spawned_translated = {alias_dict[obj] for obj in certain_spawned}
    certain_not_spawned_translated = {alias_dict[obj] for obj in certain_not_spawned}

    print("Given condition:", condition)
    print("Layouts that match:", len(matching_layouts))
    print("Guaranteed spawned:", certain_spawned_translated)
    print("Guaranteed didn't spawn:", certain_not_spawned_translated)

layouts_armsfactory = [
    {"A": 1, "B": 1, "C": 0, "D": 0, "E": 0, "F": 0, "G": 1, "H": 1, "I": 1, "J": 1, "K": 0, "L": 1},  # Layout 1
    {"A": 1, "B": 0, "C": 0, "D": 1, "E": 0, "F": 1, "G": 1, "H": 0, "I": 1, "J": 1, "K": 0, "L": 1},  # Layout 2
    {"A": 0, "B": 1, "C": 1, "D": 1, "E": 0, "F": 0, "G": 0, "H": 1, "I": 1, "J": 1, "K": 0, "L": 1},  # Layout 3
    {"A": 1, "B": 0, "C": 1, "D": 0, "E": 1, "F": 1, "G": 0, "H": 1, "I": 0, "J": 1, "K": 1, "L": 0},  # Layout 4
    {"A": 0, "B": 1, "C": 0, "D": 0, "E": 1, "F": 0, "G": 1, "H": 1, "I": 1, "J": 1, "K": 1, "L": 0},  # Layout 5
]

alias_armsfactory = [
    {"A": "deep shack"},
    {"B": "no man's"},
    {"C": "lockers"},
    {"D": "shack"},
    {"E": "shack ruins"},
    {"F": "outside middle"},
    {"G": "front gate"},
    {"H": "middle"},
    {"I": "deep sandbags"},
    {"J": "sandbags"},
    {"K": "factory"},
    {"L": "inside factory"}
]

user_input = input("Phrase: ")
evaluate_condition(user_input, layouts_armsfactory, alias_armsfactory)
