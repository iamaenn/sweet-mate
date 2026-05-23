import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../constants/theme';
import { RootTabParamList, DMStackParamList, DatePlanStackParamList, PracticeStackParamList } from '../types';

// Screens
import HomeScreen from '../screens/HomeScreen';
import ConversationListScreen from '../screens/dm/ConversationListScreen';
import DMReplyScreen from '../screens/dm/DMReplyScreen';
import DatePlanFormScreen from '../screens/dateplan/DatePlanFormScreen';
import DatePlanResultScreen from '../screens/dateplan/DatePlanResultScreen';
import PracticeHomeScreen from '../screens/practice/PracticeHomeScreen';
import PersonaSetupScreen from '../screens/practice/PersonaSetupScreen';
import PracticeSessionScreen from '../screens/practice/PracticeSessionScreen';
import PracticeFeedbackScreen from '../screens/practice/PracticeFeedbackScreen';

const Tab = createBottomTabNavigator<RootTabParamList>();
const DMStack = createStackNavigator<DMStackParamList>();
const DatePlanStack = createStackNavigator<DatePlanStackParamList>();
const PracticeStack = createStackNavigator<PracticeStackParamList>();

function DMNavigator() {
  return (
    <DMStack.Navigator screenOptions={{ headerShown: false }}>
      <DMStack.Screen name="ConversationList" component={ConversationListScreen} />
      <DMStack.Screen name="DMReply" component={DMReplyScreen} />
    </DMStack.Navigator>
  );
}

function DatePlanNavigator() {
  return (
    <DatePlanStack.Navigator screenOptions={{ headerShown: false }}>
      <DatePlanStack.Screen name="DatePlanForm" component={DatePlanFormScreen} />
      <DatePlanStack.Screen name="DatePlanResult" component={DatePlanResultScreen} />
    </DatePlanStack.Navigator>
  );
}

function PracticeNavigator() {
  return (
    <PracticeStack.Navigator screenOptions={{ headerShown: false }}>
      <PracticeStack.Screen name="PracticeHome" component={PracticeHomeScreen} />
      <PracticeStack.Screen name="PersonaSetup" component={PersonaSetupScreen} />
      <PracticeStack.Screen name="PracticeSession" component={PracticeSessionScreen} />
      <PracticeStack.Screen name="PracticeFeedback" component={PracticeFeedbackScreen} />
    </PracticeStack.Navigator>
  );
}

interface TabIconProps {
  name: string;
  focused: boolean;
  label: string;
}

function TabIcon({ name, focused, label }: TabIconProps) {
  return (
    <View style={tabStyles.iconContainer}>
      <Ionicons
        name={name as any}
        size={24}
        color={focused ? colors.primary : colors.textLight}
      />
      <Text style={[tabStyles.label, { color: focused ? colors.primary : colors.textLight }]}>
        {label}
      </Text>
    </View>
  );
}

const tabStyles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 4,
  },
  label: {
    fontSize: 10,
    marginTop: 2,
    fontWeight: '500',
  },
});

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#fff',
            borderTopColor: colors.border,
            borderTopWidth: 1,
            height: 70,
            paddingBottom: 8,
            paddingTop: 4,
          },
          tabBarShowLabel: false,
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon name={focused ? 'home' : 'home-outline'} focused={focused} label="ホーム" />
            ),
          }}
        />
        <Tab.Screen
          name="DM"
          component={DMNavigator}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon name={focused ? 'chatbubbles' : 'chatbubbles-outline'} focused={focused} label="返信提案" />
            ),
          }}
        />
        <Tab.Screen
          name="DatePlan"
          component={DatePlanNavigator}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon name={focused ? 'calendar' : 'calendar-outline'} focused={focused} label="デートプラン" />
            ),
          }}
        />
        <Tab.Screen
          name="Practice"
          component={PracticeNavigator}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon name={focused ? 'mic' : 'mic-outline'} focused={focused} label="会話練習" />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
