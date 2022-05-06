import React, {useEffect, useState, useCallback} from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Button, FlatList, SafeAreaView, ScrollView, RefreshControl,
} from "react-native";
import users from '../../assets/data/userData/users.json'
import Colors from "../../constants/Colors";
import {userMe, userPost} from "../../apiCalls/apiCalls";
import {useDispatch} from "react-redux";
import {logout} from "../../store/reducers/userReducer";

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}


const ProfileScreen = (props) => {

    const [data, setData] = useState([]);
    const [postData, setPostData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false)
    const dispatch = useDispatch();

    const loadData = async () => {
       try {
           const data1 = await userMe();
           const data2 = await userPost();
           if(data1 && data2){
               setData(data1);
               setPostData(data2);
               setIsLoading(false)
           }
       } catch(e) {
           console.log(e);
       }
    }
    useEffect(() => {
        loadData();
    }, [data, postData.length === 0, isLoading])

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setPostData([]);
        wait(2000).then(() => setRefreshing(false));
    }, []);

    const Item = ({body, pid, uid}) => (
        <View
            style={{
                backgroundColor: 'rgba(0,0,0,0.5)',
                flex: 1,
                padding: 10,
                width: '100%'
            }}>
            <Text>{body}</Text>
        </View>
    );

    const renderItem = (post) => {
        return (
            <Item body={post.item.body} pid={post.item._id} uid={post.item.uid} />
        );
    }

    const renderSectionOne = () => {
        {if(data[0].numberOfPosts === 0 ){
            return(
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderTopColor: '#c2c2c2', borderTopWidth: 1 }} >
                    <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 25, color: 'black'}} >No Posts</Text>
                </View>
            )
        } else {
            return(
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderTopColor: '#c2c2c2', borderTopWidth: 1 }} >
                    <SafeAreaView style={{padding: 10}}>
                        <ScrollView
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={onRefresh}
                                />
                            }
                        >
                            <View style={styles.screen} >
                                <FlatList
                                    style={styles.list}
                                    data={postData}
                                    keyExtractor={(post) => post.pid }
                                    ItemSeparatorComponent={() => {
                                        return (
                                            <View style={styles.separator} />
                                        )
                                    }}
                                    renderItem={renderItem}
                                />
                            </View>
                        </ScrollView>
                    </SafeAreaView>
                </View>
            )
        }
        }

    }

    const renderSection = () => {
        return (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {renderSectionOne()}
            </View>
        )
    }

    if(isLoading) {
        return (
                <Text>Loading...</Text>
            );

    } else {
        return(
            <View style={styles.container}>
                <View style={{ paddingTop: 20 }}>
                    {/** User Photo Stats**/}
                    <View style={{ flexDirection: 'row' }}>
                        {/**User photo takes 1/3rd of view horizontally **/}
                        <View
                            style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start' }}>
                            <Image
                                source={{ uri: users.users[0].profilePic }}
                                style={{ width: 75, height: 75, borderRadius: 37.5, backgroundColor: "#c2c2c2" }}
                            />
                        </View>
                        {/**User Stats take 2/3rd of view horizontally **/}
                        <View style={{ flex: 3 }}>
                            {/** Stats **/}
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'flex-end'
                                }}
                            >
                                <View style={{ alignItems: 'center', marginHorizontal: 40 }}>
                                    <View style={{ justifyContent: 'center', alignItems: 'center' }} >
                                        <Text style={{ fontSize: 18, color: 'black'}} >{data[0].numberOfPosts}</Text>
                                        <Text style={{ fontSize: 12, color: 'grey' }}>Posts</Text>
                                    </View>
                                </View>

                                <View style={{ alignItems: 'center', marginHorizontal: 40 }}>
                                    <TouchableOpacity
                                        onPress={() =>{}}
                                    >
                                        <View style={{ justifyContent: 'center', alignItems: 'center' }} >
                                            <Text style={{ fontSize: 18, color: 'black'}} >
                                                {data[0].friendList.length}
                                            </Text>
                                            <Text style={{ fontSize: 12, color: 'grey' }}>Friends</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {/**
                             * Edit profile and Settings Buttons **/}

                            { /*users.users.id === loggedInUserId ? (*/ }
                            <View style={{ alignItems: 'flex-start', paddingTop: 10 }}>
                                <View
                                    style={{ marginLeft: 10, flexDirection: 'row', width: '90%' }}>
                                    <TouchableOpacity
                                        onPress={() => {dispatch(logout());}}
                                        bordered
                                        dark
                                        style={{
                                            flex: 1,
                                            justifyContent: 'center',
                                            height: 30,
                                            paddingHorizontal: 83,
                                            alignItems: 'center',
                                            backgroundColor: Colors.primary }}
                                    >
                                        <Text style={{color: 'white'}}>Edit Profile</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            { /* ) : (
                            <View style={{ flexDirection: 'row', alignItems: 'flex-start', paddingTop: 10 }}>
                                <TouchableOpacity
                                    style={{ flexDirection: 'row' }}>
                                    <Button
                                        onPress={followUserHandler}
                                        bordered
                                        dark
                                        style={{ flex: 2, marginLeft: 10, marginRight: 10, justifyContent: 'center', height: 30 }}
                                    >
                                        { checkFollow(currUser._id) ? (
                                            <>
                                                { isFollowLoading ? (
                                                    <ActivityIndicator size="small" color="#fff" />
                                                ) : (
                                                    <Text style={{ color: 'black' }} >Unfollow</Text>
                                                ) }
                                            </>
                                       ) : (
                                            <>
                                                { isFollowLoading ? (
                                                    <ActivityIndicator size="small" color="#fff" />
                                                ) : (
                                                    <Text style={{ color: 'black' }} >Follow</Text>
                                                ) }
                                            </>
                                        ) }
                                    </Button>
                                </TouchableOpacity>
                            </View>
                        ) }*/}
                            {/**End edit profile**/}
                        </View>
                    </View>

                    <View style={{ paddingBottom: 10, paddingTop: 10 }}>
                        <View style={{ paddingHorizontal: 10 }} >
                            <Text style={{fontSize: 18, color: 'black'}}>
                                {data[0].name}
                            </Text>
                            { (data[0].bio.length > 0) && (
                                <Text style={{color: 'black'}}>{data[0].bio}</Text>
                            ) }
                        </View>
                    </View>
                </View>
                <View>
                    {renderSection()}
                </View>

            </View>
        )
    }
}

{/*export const screenOptions = (navData) => {
    const routeParams = navData.route.params ? navData.route.params : {};
    if(!routeParams.name){
        return{
            headerTitle: routeParams.name ? routeParams.name : "Profile",
            headerRight: () => (
                <MenuItem />
            )
        }
    } else {
        return{
            headerTitle: routeParams.name ? routeParams.name : "Profile",
        }
    }
}*/}

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    list: {
        width: '100%',
    },
    separator: {
        marginTop: 10,
    },
});

export default ProfileScreen;
