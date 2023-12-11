import React, { useContext, useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  Switch,
  StyleSheet,
  Button,
  Alert,
  Modal,
  ActivityIndicator,
  TextInput,
  Image,
  TouchableOpacity,
} from "react-native";
import { BuildsContext } from "../BuildsContext";
import { Picker } from "@react-native-picker/picker";
import { ScrollView } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/FontAwesome";
import { addPartRequest } from "../services/partService";
import * as MailComposer from "expo-mail-composer";
import { getHospitals } from "../services/hospitalsService";

const partColors = [
  "Black",
  "Blue",
  "Gray",
  "Green",
  "Magenta",
  "Orange",
  "Pink",
  "Red",
  "Tan",
  "White",
  "Yellow",
];

const SettingsScreen = () => {
  const scrollViewRef = useRef();
  const {
    builds,
    toggleVisibility,
    downloadAndSaveBuilds,
    toggleShowAllBuilds,
    showAllBuilds,
  } = useContext(BuildsContext);
  const kitColors = ["Blue", "Green", "Orange", "Yellow", "Red", "Purple"];
  const [isDownloading, setIsDownloading] = useState(false);
  const [currentTab, setCurrentTab] = useState("View");
  const [name, setName] = useState("");
  const [hospital, setHospital] = useState("Select Hospital");
  const [selectedColor, setSelectedColor] = useState(null);
  const [isSubmitButtonVisible, setSubmitButtonVisible] = useState(false);
  const [hospitals, setHospitals] = useState([]);
  const [parts, setParts] = useState(
    [
      {
        id: "65241873cd70c9e0663ca740",
        pic: "3001.medium-blue.png",
        picRef: require("../assets/parts/3001.medium-blue.png"),
        name: "Brick 2 x 4",
        colorCode: 42,
        partNumber: "3001",
        color: "Medium Blue",
        genericColor: "Blue",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca741",
        pic: "630-3.orange.png",
        picRef: require("../assets/parts/630-3.orange.png"),
        name: "Brick Separator",
        partNumber: "630-3",
        color: "Orange",
        genericColor: "Orange",
        colorCode: 0,
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca742",
        pic: "2340.white.png",
        picRef: require("../assets/parts/2340.white.png"),
        name: "Tail 4 x 1 x 3",
        colorCode: 1,
        partNumber: "2340",
        color: "White",
        genericColor: "White",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca743",
        pic: "2458.light-bluish-gray.png",
        picRef: require("../assets/parts/2458.light-bluish-gray.png"),
        name: "Brick, Modified 1 x 2 with Pin",
        colorCode: 86,
        partNumber: "2458",
        color: "Light Bluish Gray",
        genericColor: "Gray",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca744",
        pic: "2460.white.png",
        picRef: require("../assets/parts/2460.white.png"),
        name: "Tile, Modified 2 x 2 with Pin",
        colorCode: 1,
        partNumber: "2460",
        color: "White",
        genericColor: "White",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca745",
        pic: "2780.black.png",
        picRef: require("../assets/parts/2780.black.png"),
        name: "Technic, Pin with Short Friction Ridges",
        colorCode: 11,
        partNumber: "2780",
        color: "Black",
        genericColor: "Black",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca746",
        pic: "2815.medium-azure.png",
        picRef: require("../assets/parts/2815.medium-azure.png"),
        name: "Tire Technic Wedge Belt Wheel",
        colorCode: 156,
        partNumber: "2815",
        color: "Medium Azure",
        genericColor: "Blue",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca747",
        pic: "3003.black.png",
        picRef: require("../assets/parts/3003.black.png"),
        name: "Brick 2 x 2",
        colorCode: 11,
        partNumber: "3003",
        color: "Black",
        genericColor: "Black",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca748",
        pic: "3004.medium-blue.png",
        picRef: require("../assets/parts/3004.medium-blue.png"),
        name: "Brick 1 x 2",
        colorCode: 42,
        partNumber: "3004",
        color: "Medium Blue",
        genericColor: "Blue",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca749",
        pic: "3005.yellow.png",
        picRef: require("../assets/parts/3005.yellow.png"),
        name: "Brick 1 x 1",
        colorCode: 3,
        partNumber: "3005",
        color: "Yellow",
        genericColor: "Yellow",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca74a",
        pic: "3010.medium-blue.png",
        picRef: require("../assets/parts/3010.medium-blue.png"),
        name: "Brick 1 x 4",
        colorCode: 42,
        partNumber: "3010",
        color: "Medium Blue",
        genericColor: "Blue",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca74b",
        pic: "3010.orange.png",
        picRef: require("../assets/parts/3010.orange.png"),
        name: "Brick 1 x 4",
        colorCode: 4,
        partNumber: "3010",
        color: "Orange",
        genericColor: "Orange",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca74c",
        pic: "3023.white.png",
        picRef: require("../assets/parts/3023.white.png"),
        name: "Plate 1 x 2",
        colorCode: 1,
        partNumber: "3023",
        color: "White",
        genericColor: "White",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca74d",
        pic: "3039.magenta.png",
        picRef: require("../assets/parts/3039.magenta.png"),
        name: "Slope 45 2 x 2",
        colorCode: 71,
        partNumber: "3039",
        color: "Magenta",
        genericColor: "Magenta",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca74e",
        pic: "3040.bright-green.png",
        picRef: require("../assets/parts/3040.bright-green.png"),
        name: "Slope 45 2 x 1",
        colorCode: 36,
        partNumber: "3040",
        color: "Bright Green",
        genericColor: "Green",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca74f",
        pic: "3069b.orange.png",
        picRef: require("../assets/parts/3069b.orange.png"),
        name: "Tile 1 x 2 with Groove",
        colorCode: 4,
        partNumber: "3069b",
        color: "Orange",
        genericColor: "Orange",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca750",
        pic: "3298.dark-azure.png",
        picRef: require("../assets/parts/3298.dark-azure.png"),
        name: "Slope 33 3 x 2",
        colorCode: 153,
        partNumber: "3298",
        color: "Dark Azure",
        genericColor: "Blue",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca751",
        pic: "3649.light-bluish-gray.png",
        picRef: require("../assets/parts/3649.light-bluish-gray.png"),
        name: "Technic, Gear 40 Tooth",
        colorCode: 86,
        partNumber: "3649",
        color: "Light Bluish Gray",
        genericColor: "Gray",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca752",
        pic: "3673.light-bluish-gray.png",
        picRef: require("../assets/parts/3673.light-bluish-gray.png"),
        name: "Technic, Pin without Friction Ridges",
        colorCode: 86,
        partNumber: "3673",
        color: "Light Bluish Gray",
        genericColor: "Gray",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca753",
        pic: "3701.magenta.png",
        picRef: require("../assets/parts/3701.magenta.png"),
        name: "Technic, Brick 1 x 4 with Holes",
        colorCode: 71,
        partNumber: "3701",
        color: "Magenta",
        genericColor: "Magenta",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca754",
        pic: "3702.dark-azure.png",
        picRef: require("../assets/parts/3702.dark-azure.png"),
        name: "Technic, Brick 1 x 8 with Holes",
        colorCode: 153,
        partNumber: "3702",
        color: "Dark Azure",
        genericColor: "Blue",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca755",
        pic: "3703.lime.png",
        picRef: require("../assets/parts/3703.lime.png"),
        name: "Technic, Brick 1 x 16 with Holes",
        colorCode: 34,
        partNumber: "3703",
        color: "Lime",
        genericColor: "Green",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca756",
        pic: "3709b.bright-light-orange.png",
        picRef: require("../assets/parts/3709b.bright-light-orange.png"),
        name: "Technic, Plate 2 x 4 with 3 Holes",
        colorCode: 11,
        partNumber: "3709b",
        color: "Bright Light Orange",
        genericColor: "Orange",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca757",
        pic: "3710.white.png",
        picRef: require("../assets/parts/3710.white.png"),
        name: "Plate 1 x 4",
        colorCode: 1,
        partNumber: "3710",
        color: "White",
        genericColor: "White",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca758",
        pic: "3737.black.png",
        picRef: require("../assets/parts/3737.black.png"),
        name: "Technic, Axle 10L",
        colorCode: 11,
        partNumber: "3737",
        color: "Black",
        genericColor: "Black",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca759",
        pic: "3738.bright-green.png",
        picRef: require("../assets/parts/3738.bright-green.png"),
        name: "Technic, Plate 2 x 8 with 7 Holes",
        colorCode: 36,
        partNumber: "3738",
        color: "Bright Green",
        genericColor: "Green",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca75a",
        pic: "3749.tan.png",
        picRef: require("../assets/parts/3749.tan.png"),
        name: "Technic, Axle 1L with Pin without Friction Ridges",
        colorCode: 2,
        partNumber: "3749",
        color: "Tan",
        genericColor: "Tan",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca75b",
        pic: "3895.bright-light-orange.png",
        picRef: require("../assets/parts/3895.bright-light-orange.png"),
        name: "Technic, Brick 1 x 12 with Holes",
        colorCode: 110,
        partNumber: "3895",
        color: "Bright Light Orange",
        genericColor: "Orange",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca75c",
        pic: "3895.lime.png",
        picRef: require("../assets/parts/3895.lime.png"),
        name: "Technic, Brick 1 x 12 with Holes",
        colorCode: 34,
        partNumber: "3895",
        color: "Lime",
        genericColor: "Green",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca75d",
        pic: "3941.green.png",
        picRef: require("../assets/parts/3941.green.png"),
        name: "Brick, Round 2 x 2 with Axle Hole",
        colorCode: 6,
        partNumber: "3941",
        color: "Green",
        genericColor: "Green",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca75e",
        pic: "3960.trans-light-blue.png",
        picRef: require("../assets/parts/3960.trans-light-blue.png"),
        name: "Dish 4 x 4 Inverted (Radar) with Solid Stud",
        colorCode: 15,
        partNumber: "3960",
        color: "Trans Light Blue",
        genericColor: "Blue",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca75f",
        pic: "3960.white.png",
        picRef: require("../assets/parts/3960.white.png"),
        name: "Dish 4 x 4 Inverted (Radar) with Solid Stud",
        colorCode: 1,
        partNumber: "3960",
        color: "White",
        genericColor: "White",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca760",
        pic: "4032.bright-green.png",
        picRef: require("../assets/parts/4032.bright-green.png"),
        name: "Plate, Round 2 x 2 with Axle Hole",
        colorCode: 36,
        partNumber: "4032",
        color: "Bright Green",
        genericColor: "Green",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca761",
        pic: "4073.bright-pink.png",
        picRef: require("../assets/parts/4073.bright-pink.png"),
        name: "Plate, Round 1 x 1",
        colorCode: 104,
        partNumber: "4073",
        color: "Bright Pink",
        genericColor: "Pink",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca762",
        pic: "4185.white.png",
        picRef: require("../assets/parts/4185.white.png"),
        name: "Technic Wedge Belt Wheel (Pulley)",
        colorCode: 1,
        partNumber: "4185",
        color: "White",
        genericColor: "White",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca763",
        pic: "4286.bright-light-orange.png",
        picRef: require("../assets/parts/4286.bright-light-orange.png"),
        name: "Slope 33 3 x 1",
        colorCode: 110,
        partNumber: "4286",
        color: "Bright Light Orange",
        genericColor: "Orange",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca764",
        pic: "4519.light-bluish-gray.png",
        picRef: require("../assets/parts/4519.light-bluish-gray.png"),
        name: "Technic, Axle 3L",
        colorCode: 86,
        partNumber: "4519",
        color: "Light Bluish Gray",
        genericColor: "Gray",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca765",
        pic: "4589b.magenta.png",
        picRef: require("../assets/parts/4589b.magenta.png"),
        name: "Cone 1 x 1 with Top Groove",
        colorCode: 71,
        partNumber: "4589b",
        color: "Magenta",
        genericColor: "Magenta",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca766",
        pic: "4592c02.light-bluish-gray.png",
        picRef: require("../assets/parts/4592c02.light-bluish-gray.png"),
        name: "Antenna Small Base with Black Lever",
        colorCode: 86,
        partNumber: "4592c02",
        color: "Light Bluish Gray",
        genericColor: "Gray",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca767",
        pic: "4617.yellow.png",
        picRef: require("../assets/parts/4617.yellow.png"),
        name: "Propeller 3 Blade 5.5 Diameter",
        colorCode: 3,
        partNumber: "4617",
        color: "Yellow",
        genericColor: "Yellow",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca768",
        pic: "4727.bright-green.png",
        picRef: require("../assets/parts/4727.bright-green.png"),
        name: "Plant Flower 2 x 2 Leaves - Angular",
        colorCode: 36,
        partNumber: "4727",
        color: "Bright Green",
        genericColor: "Green",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca769",
        pic: "6538c.yellow.png",
        picRef: require("../assets/parts/6538c.yellow.png"),
        name: "Technic, Axle Connector 2L (Smooth with x Hole + Orientation)",
        colorCode: 3,
        partNumber: "6538c",
        color: "Yellow",
        genericColor: "Yellow",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca76a",
        pic: "14769pb264.white.png",
        picRef: require("../assets/parts/14769pb264.white.png"),
        name: "Tile, Round 2 x 2 with Bottom Stud Holder with Eye with Metallic Light Blue Iris and Black Pupil Pattern",
        colorCode: 1,
        partNumber: "14769pb264",
        color: "White",
        genericColor: "White",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca76b",
        pic: "15254.yellow.png",
        picRef: require("../assets/parts/15254.yellow.png"),
        name: "Arch 1 x 6 x 2 - Medium Thick Top without Reinforced Underside",
        colorCode: 3,
        partNumber: "15254",
        color: "Yellow",
        genericColor: "Yellow",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca76c",
        pic: "15279.bright-green.png",
        picRef: require("../assets/parts/15279.bright-green.png"),
        name: "Plant Grass Stem",
        colorCode: 36,
        partNumber: "15279",
        color: "Bright Green",
        genericColor: "Green",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca76d",
        pic: "15573.white.png",
        picRef: require("../assets/parts/15573.white.png"),
        name: "Plate, Modified 1 x 2 with 1 Stud with Groove and Bottom Stud Holder (Jumper)",
        colorCode: 1,
        partNumber: "15573",
        color: "White",
        genericColor: "White",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca76e",
        pic: "18651.white.jpg",
        picRef: require("../assets/parts/18651.white.jpg"),
        name: "Technic, Axle 2L with Pin with Friction Ridges",
        colorCode: 1,
        partNumber: "18651",
        color: "White",
        genericColor: "White",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca76f",
        pic: "18653.orange.png",
        picRef: require("../assets/parts/18653.orange.png"),
        name: "Arch 1 x 3 x 2 Inverted",
        colorCode: 4,
        partNumber: "18653",
        color: "Orange",
        genericColor: "Orange",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca770",
        pic: "30414.white.png",
        picRef: require("../assets/parts/30414.white.png"),
        name: "Brick, Modified 1 x 4 with Studs on Side",
        colorCode: 1,
        partNumber: "30414",
        color: "White",
        genericColor: "White",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca771",
        pic: "32001.bright-light-orange.png",
        picRef: require("../assets/parts/32001.bright-light-orange.png"),
        name: "Technic, Plate 2 x 6 with 5 Holes",
        colorCode: 110,
        partNumber: "32001",
        color: "Bright Light Orange",
        genericColor: "Orange",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca772",
        pic: "32001.dark-azure.png",
        picRef: require("../assets/parts/32001.dark-azure.png"),
        name: "Technic, Plate 2 x 6 with 5 Holes",
        colorCode: 153,
        partNumber: "32001",
        color: "Dark Azure",
        genericColor: "Blue",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca773",
        pic: "32059.bright-light-orange.png",
        picRef: require("../assets/parts/32059.bright-light-orange.png"),
        name: "Wedge, Plate 4 x 6 Cut Corners",
        colorCode: 110,
        partNumber: "32059",
        color: "Bright Light Orange",
        genericColor: "Orange",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca774",
        pic: "32059.lime.png",
        picRef: require("../assets/parts/32059.lime.png"),
        name: "Wedge, Plate 4 x 6 Cut Corners",
        colorCode: 34,
        partNumber: "32059",
        color: "Lime",
        genericColor: "Green",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca775",
        pic: "32062.red.png",
        picRef: require("../assets/parts/32062.red.png"),
        name: "Technic, Axle 2L Notched",
        colorCode: 5,
        partNumber: "32062",
        color: "Red",
        genericColor: "Red",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca776",
        pic: "32064.red.png",
        picRef: require("../assets/parts/32064.red.png"),
        name: "Technic, Brick 1 x 2 with Axle Hole",
        colorCode: 5,
        partNumber: "32064",
        color: "Red",
        genericColor: "Red",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca777",
        pic: "32064.yellow.png",
        picRef: require("../assets/parts/32064.yellow.png"),
        name: "Technic, Brick 1 x 2 with Axle Hole",
        colorCode: 3,
        partNumber: "32064",
        color: "Yellow",
        genericColor: "Yellow",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca778",
        pic: "32192.lime.png",
        picRef: require("../assets/parts/32192.lime.png"),
        name: "Technic, Axle and Pin Connector Angled #4 - 135 degrees",
        colorCode: 34,
        partNumber: "32192",
        color: "Lime",
        genericColor: "Green",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca779",
        pic: "32269.black.png",
        picRef: require("../assets/parts/32269.black.png"),
        name: "Technic, Gear 20 Tooth Double Bevel",
        colorCode: 11,
        partNumber: "32269",
        color: "Black",
        genericColor: "Black",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca77a",
        pic: "32270.black.png",
        picRef: require("../assets/parts/32270.black.png"),
        name: "Technic, Gear 12 Tooth Double Bevel",
        colorCode: 11,
        partNumber: "32270",
        color: "Black",
        genericColor: "Black",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca77b",
        pic: "32316.yellow.png",
        picRef: require("../assets/parts/32316.yellow.png"),
        name: "Technic, Liftarm Thick 1 x 5",
        colorCode: 3,
        partNumber: "32316",
        color: "Yellow",
        genericColor: "Yellow",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca77c",
        pic: "32524.blue.png",
        picRef: require("../assets/parts/32524.blue.png"),
        name: "Technic, Liftarm Thick 1 x 7",
        colorCode: 7,
        partNumber: "32524",
        color: "Blue",
        genericColor: "Blue",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca77d",
        pic: "32524.bright-green.png",
        picRef: require("../assets/parts/32524.bright-green.png"),
        name: "Technic, Liftarm Thick 1 x 7",
        colorCode: 36,
        partNumber: "32524",
        color: "Bright Green",
        genericColor: "Green",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca77e",
        pic: "32524.red.png",
        picRef: require("../assets/parts/32524.red.png"),
        name: "Technic, Liftarm Thick 1 x 7",
        colorCode: 5,
        partNumber: "32524",
        color: "Red",
        genericColor: "Red",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca77f",
        pic: "32525.magenta.png",
        picRef: require("../assets/parts/32525.magenta.png"),
        name: "Technic, Liftarm Thick 1 x 11",
        colorCode: 71,
        partNumber: "32525",
        color: "Magenta",
        genericColor: "Magenta",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca780",
        pic: "32526.bright-green.png",
        picRef: require("../assets/parts/32526.bright-green.png"),
        name: "Technic, Liftarm, Modified Bent Thick L-Shape 3 x 5",
        colorCode: 36,
        partNumber: "32526",
        color: "Bright Green",
        genericColor: "Green",
        quantity: 2,
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca781",
        pic: "33299.red.png",
        picRef: require("../assets/parts/33299.red.png"),
        name: "Technic, Liftarm, Modified Crank / Pin 1 x 3 - Axle Holes",
        colorCode: 5,
        partNumber: "33299",
        color: "Red",
        genericColor: "Red",
        quantity: 2,
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca782",
        pic: "39793.magenta.png",
        picRef: require("../assets/parts/39793.magenta.png"),
        name: "Technic, Pin Connector Block, Liftarm 1 x 3 x 3",
        colorCode: 71,
        partNumber: "39793",
        color: "Magenta",
        genericColor: "Magenta",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca783",
        pic: "41539.white.png",
        picRef: require("../assets/parts/41539.white.png"),
        name: "Plate 8 x 8",
        colorCode: 1,
        partNumber: "41539",
        color: "White",
        genericColor: "White",
        quantity: 2,
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca784",
        pic: "42022.lime.png",
        picRef: require("../assets/parts/42022.lime.png"),
        name: "Slope, Curved 6 x 1",
        colorCode: 34,
        partNumber: "42022",
        color: "Lime",
        genericColor: "Green",
        quantity: 2,
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca785",
        pic: "42022.trans-light-blue.png",
        picRef: require("../assets/parts/42022.trans-light-blue.png"),
        name: "Slope, Curved 6 x 1",
        colorCode: 15,
        partNumber: "42022",
        color: "Trans Light Blue",
        genericColor: "Blue",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca786",
        pic: "43093.blue.png",
        picRef: require("../assets/parts/43093.blue.png"),
        name: "Technic, Axle 1L with Pin with Friction Ridges",
        colorCode: 7,
        partNumber: "43093",
        color: "Blue",
        genericColor: "Blue",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca787",
        pic: "43713.white.png",
        picRef: require("../assets/parts/43713.white.png"),
        name: "Wedge 6 x 4 Triple Inverted Curved",
        colorCode: 1,
        partNumber: "43713",
        color: "White",
        genericColor: "White",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca788",
        pic: "44728.white.png",
        picRef: require("../assets/parts/44728.white.png"),
        name: "Bracket 1 x 2 - 2 x 2",
        colorCode: 1,
        partNumber: "44728",
        color: "White",
        genericColor: "White",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca789",
        pic: "45590.black.png",
        picRef: require("../assets/parts/45590.black.png"),
        name: "Technic, Axle Connector Double - Flexible Rubber",
        colorCode: 11,
        partNumber: "45590",
        color: "Black",
        genericColor: "Black",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca78a",
        pic: "48989.light-bluish-gray.png",
        picRef: require("../assets/parts/48989.light-bluish-gray.png"),
        name: "Technic, Pin Connector Perpendicular 3L with 4 Pins",
        colorCode: 86,
        partNumber: "48989",
        color: "Light Bluish Gray",
        genericColor: "Gray",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca78b",
        pic: "55982.white.png",
        picRef: require("../assets/parts/55982.white.png"),
        name: "Wheel 18mm D. x 14mm with Axle Hole, Fake Bolts and Shallow Spokes",
        colorCode: 1,
        partNumber: "55982",
        color: "White",
        genericColor: "White",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca78c",
        pic: "56891.black.png",
        picRef: require("../assets/parts/56891.black.png"),
        name: "Tire 37 x 18R",
        colorCode: 11,
        partNumber: "56891",
        color: "Black",
        genericColor: "Black",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca78d",
        pic: "60483.lime.png",
        picRef: require("../assets/parts/60483.lime.png"),
        name: "Technic, Liftarm Thick 1 x 2 - Axle Hole",
        colorCode: 34,
        partNumber: "60483",
        color: "Lime",
        genericColor: "Green",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca78e",
        pic: "64179.light-bluish-gray.png",
        picRef: require("../assets/parts/64179.light-bluish-gray.png"),
        name: "Technic, Liftarm, Modified Frame Thick 5 x 7 Open Center",
        colorCode: 86,
        partNumber: "64179",
        color: "Light Bluish Gray",
        genericColor: "Gray",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca78f",
        pic: "64799.light-bluish-gray.png",
        picRef: require("../assets/parts/64799.light-bluish-gray.png"),
        name: "Plate, Modified 4 x 4 with 2 x 2 Open Center",
        colorCode: 86,
        partNumber: "64799",
        color: "Light Bluish Gray",
        genericColor: "Gray",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca790",
        pic: "72454.white.png",
        picRef: require("../assets/parts/72454.white.png"),
        name: "Slope, Inverted 45 4 x 4 Double with 2 Holes",
        colorCode: 1,
        partNumber: "72454",
        color: "White",
        genericColor: "White",
        quantity: 2,
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca791",
        pic: "85984.bright-light-orange.png",
        picRef: require("../assets/parts/85984.bright-light-orange.png"),
        name: "Slope 30 1 x 2 x 2/3",
        colorCode: 110,
        partNumber: "85984",
        color: "Bright Light Orange",
        genericColor: "Orange",
        quantity: 9,
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca792",
        pic: "87079.light-bluish-gray.png",
        picRef: require("../assets/parts/87079.light-bluish-gray.png"),
        name: "Tile 2 x 4",
        colorCode: 86,
        partNumber: "87079",
        color: "Light Bluish Gray",
        genericColor: "Gray",
        quantity: 3,
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca793",
        pic: "87083.dark-bluish-gray.png",
        picRef: require("../assets/parts/87083.dark-bluish-gray.png"),
        name: "Technic, Axle 4L with Stop",
        colorCode: 85,
        partNumber: "87083",
        color: "Dark Bluish Gray",
        genericColor: "Gray",
        quantity: 8,
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca794",
        pic: "87087.red.png",
        picRef: require("../assets/parts/87087.red.png"),
        name: "Brick, Modified 1 x 1 with Stud on Side",
        colorCode: 5,
        partNumber: "87087",
        color: "Red",
        genericColor: "Red",
        quantity: 5,
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca795",
        pic: "87087.white.png",
        picRef: require("../assets/parts/87087.white.png"),
        name: "Brick, Modified 1 x 1 with Stud on Side",
        colorCode: 1,
        partNumber: "87087",
        color: "White",
        genericColor: "White",
        quantity: 5,
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca796",
        pic: "94925.light-bluish-gray.png",
        picRef: require("../assets/parts/94925.light-bluish-gray.png"),
        name: "Technic, Gear 16 Tooth (Second Version - Reinforced)",
        colorCode: 86,
        partNumber: "94925",
        color: "Light Bluish Gray",
        genericColor: "Gray",
        quantity: 2,
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca797",
        pic: "95347.yellow.png",
        picRef: require("../assets/parts/95347.yellow.png"),
        name: "Support 2 x 2 x 10 Girder Triangular Vertical - Type 4 - 3 Posts, 3 Sections",
        colorCode: 3,
        partNumber: "95347",
        color: "Yellow",
        genericColor: "Yellow",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca798",
        pic: "98138pb007.white.png",
        picRef: require("../assets/parts/98138pb007.white.png"),
        name: "Tile, Round 1 x 1 with Black Eye with Pupil Pattern",
        colorCode: 1,
        partNumber: "98138pb007",
        color: "White",
        genericColor: "White",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca799",
        pic: "98262.red.png",
        picRef: require("../assets/parts/98262.red.png"),
        name: "Plant Flower 2 x 2 Rounded - Solid Stud",
        colorCode: 5,
        partNumber: "98262",
        color: "Red",
        genericColor: "Red",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca79a",
        pic: "99780.green.png",
        picRef: require("../assets/parts/99780.green.png"),
        name: "Bracket 1 x 2 - 1 x 2 Inverted",
        colorCode: 6,
        partNumber: "99780",
        color: "Green",
        genericColor: "Green",
        quantity: 0,
      },
      {
        id: "65241873cd70c9e0663ca79b",
        pic: "bb0164c01.light-gray.png",
        picRef: require("../assets/parts/bb0164c01.light-gray.png"),
        name: "Plate, Modified 2 x 2 Thin with Dual Wheels Holder - Solid Pins with Space Shuttle Wheels",
        colorCode: 9,
        partNumber: "bb0164c01",
        color: "Light Gray",
        genericColor: "Gray",
        quantity: 0,
      },
    ].sort((a, b) => a.genericColor.localeCompare(b.genericColor))
  );

  const filteredParts = selectedColor
    ? parts.filter((part) => part.genericColor === selectedColor)
    : parts;

  const handleNameChange = (text) => setName(text);
  const handleHospitalChange = (selectedValue) => {
    setHospital(selectedValue);
  };

  const updateSubmitButtonVisibility = () => {
    const hasValidInput =
      name.trim() !== "" &&
      hospital !== "Select Hospital" &&
      parts.some((part) => part.quantity > 0);

    setSubmitButtonVisible(hasValidInput);
  };

  const handleQuantityChange = (partId, quantity) => {
    quantity = Math.max(0, quantity);

    const updatedParts = parts.map((part) => {
      if (part.id === partId) {
        return { ...part, quantity };
      } else {
        return part;
      }
    });

    setParts(updatedParts);
  };

  const handleViewTab = () => {
    setCurrentTab("View");
  };

  const handleRequestTab = () => {
    setCurrentTab("Request");
  };

  const updateHandler = async () => {
    setIsDownloading(true);
    await downloadAndSaveBuilds();
    setIsDownloading(false);
  };

  const handleUpdateBuilds = () => {
    Alert.alert(
      "Attention",
      "You must have a stable internet connection",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        { text: "Proceed", onPress: () => updateHandler() },
      ],
      { cancelable: true }
    );
  };

  const handleFormSubmit = async () => {
    try {
      // Filter parts to include only those with quantity greater than 0
      const selectedParts = parts
        .filter((part) => part.quantity > 0)
        .map(({ id, quantity }) => ({ id, quantity }));

      // Create the object with the required properties
      const requestData = {
        employee: name,
        hospital,
        parts: selectedParts,
      };

      const emailBody = `
        Thank you ${name} for submitting your <a href="https://buildup-steam.web.app/requests" style="text-decoration: none; color: #0000EE;">request.</a>\n\n 
        Please send this email as an additional way of notifying Buildup STEAM of your request.
      `;

      const emailResult = await MailComposer.composeAsync({
        recipients: ["john@buildupsteam.org"],
        subject: "Part Request [DO NOT EDIT]",
        body: emailBody,
        isHtml: true,
      });

      // Check if the email was sent successfully
      if (emailResult.status === "sent") {
        await addPartRequest(requestData);
        setName("");
        setHospital("Select Hospital");
        setSelectedColor(null);
        setParts((prevParts) =>
          prevParts.map((part) => ({ ...part, quantity: 0 }))
        );

        // Scroll to the top
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
        }

        // Show popup
        Alert.alert(
          "Part(s) Requested",
          "Your part request and email have been submitted successfully."
        );
      } else {
        // Handle case where the user didn't send the email
        Alert.alert(
          "Email Cancelled",
          "Please notify a Buildup STEAM employee about your request."
        );
      }
    } catch (error) {
      console.error("Error sending email:", error);
      // Handle error, show alert, etc.
      return;
    }
  };

  const renderViewContent = () => {
    return (
      <>
        <View style={styles.item}>
          <Text style={styles.title}>Show All Builds?</Text>
          <Switch
            style={styles.toggle}
            trackColor={{ false: "black", true: "#34C759" }}
            ios_backgroundColor="black"
            onValueChange={() => toggleShowAllBuilds()}
            value={showAllBuilds}
          />
        </View>
        <FlatList
          data={kitColors}
          renderItem={({ item }) => {
            return (
              <View style={styles.item}>
                <Text style={styles.title}>{item}</Text>
                <Switch
                  style={styles.toggle}
                  trackColor={{ false: "black", true: "#34C759" }}
                  ios_backgroundColor="black"
                  onValueChange={() => toggleVisibility(item)}
                  value={
                    builds.find((build) => build.kitColor === item)?.visibility
                  }
                />
              </View>
            );
          }}
          keyExtractor={(item) => item}
        />
        <Button title="Update Builds" onPress={handleUpdateBuilds} />
        <Modal animationType="fade" transparent={true} visible={isDownloading}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <ActivityIndicator size="large" color="#0000ff" />
              <Text style={{ marginTop: 10 }}>This may take a few minutes</Text>
            </View>
          </View>
        </Modal>
      </>
    );
  };

  const renderRequestContent = () => {
    return (
      <ScrollView ref={scrollViewRef} style={{ position: "relative" }}>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Requester Name:</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={handleNameChange}
            placeholder="Enter your first name"
            placeholderTextColor="#666"
          />

          <Text style={styles.label}>Hospital:</Text>
          <Picker
            selectedValue={hospital}
            onValueChange={handleHospitalChange}
            style={styles.picker}
            itemStyle={styles.pickerItem}
          >
            <Picker.Item label="Select Hospital" value="Select Hospital" />
            {hospitals.map((item) => (
              <Picker.Item key={item} label={item} value={item} />
            ))}
          </Picker>

          <Text style={styles.label}>Filter by Color (Optional)</Text>
          <Picker
            selectedValue={selectedColor}
            onValueChange={(itemValue) => setSelectedColor(itemValue)}
            style={styles.picker}
            itemStyle={styles.pickerItem}
          >
            <Picker.Item label="All Colors" value={null} />
            {partColors.map((color) => (
              <Picker.Item key={color} label={color} value={color} />
            ))}
          </Picker>

          <Text style={styles.label}>Part Request</Text>
          {filteredParts.map((part) => (
            <View key={part.id} style={styles.partContainer}>
              <Text style={styles.partLabel}>{part.name}</Text>
              <Image style={styles.partImage} source={part.picRef} />
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  onPress={() =>
                    handleQuantityChange(part.id, part.quantity - 1)
                  }
                >
                  <Icon name="caret-down" size={50} color="#000" />
                </TouchableOpacity>
                <TextInput
                  keyboardType="numeric"
                  style={styles.quantityInput}
                  value={part.quantity.toString()}
                  onChangeText={(text) =>
                    handleQuantityChange(part.id, parseInt(text))
                  }
                />
                <TouchableOpacity
                  onPress={() =>
                    handleQuantityChange(part.id, part.quantity + 1)
                  }
                >
                  <Icon name="caret-up" size={50} color="#000" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    );
  };

  useEffect(() => {
    updateSubmitButtonVisibility();
  }, [name, hospital, parts]);

  useEffect(() => {
    (async () => {
      setHospitals(await getHospitals());
    })();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        <Button
          title="View"
          onPress={handleViewTab}
          disabled={currentTab === "View"}
        />
        <Button
          title="Request"
          onPress={handleRequestTab}
          disabled={currentTab === "Request"}
        />
      </View>

      {currentTab === "View" ? (
        renderViewContent()
      ) : (
        <View style={{ flex: 1 }}>
          {renderRequestContent()}
          {isSubmitButtonVisible && (
            <TouchableOpacity
              style={styles.floatingButton}
              onPress={handleFormSubmit}
            >
              <Text style={styles.floatingButtonText}>Submit Request</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 40,
    borderRadius: 10,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: "100%",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  toggle: {
    marginRight: 5,
  },
  formContainer: {
    flex: 1,
    padding: 20,
  },
  picker: {
    width: 300,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    alignSelf: "center",
  },
  pickerItem: {
    color: "#666",
  },
  label: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  partContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    width: 300,
    marginBottom: 10,
    padding: 10,
    alignSelf: "center",
  },
  partLabel: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  partImage: {
    width: 150,
    resizeMode: "contain",
    alignSelf: "center",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  quantityInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    fontWeight: "bold",
    textAlign: "center",
    width: 50, // Adjust the width as needed
    marginHorizontal: 20,
  },
  floatingButton: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "#34C759", // Use your desired background color
    padding: 10,
    borderRadius: 8,
    elevation: 5,
  },
  floatingButtonText: {
    color: "#fff", // Change the text color as needed
    fontWeight: "bold",
  },
});

export default SettingsScreen;
