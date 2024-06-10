import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
} from 'react-native';
import Star from '../../assets/sgv/star.svg'; // Assuming you have star icons
import DarkStar from '../../assets/sgv/darkStar.svg'; // Assuming you have star icons
import { useDispatch, useSelector } from 'react-redux';
import { add_review, get_RestauRantDetails } from '../../redux/feature/featuresSlice';
;

export default function RestaurantReview({ restaurant }) {
    const user = useSelector(state => state.auth.userData);
    const [rating, setRating] = useState(0); // Initial star rating
    const [comment, setComment] = useState('');
    const dispatch = useDispatch()
    const StarData = [1, 2, 3, 4, 5]; // Star data for rendering stars

    const submitReview = async() => {

        console.log('Rating:', rating);
        console.log('Comment:', comment);
        const params = {
            resrev_restaurants_id: restaurant?.res_id,
            resrev_rating: rating,
            resrev_review_text: comment,
            token: user?.token

        }

       await dispatch(add_review(params)).then(res=>{
        const params = {
            data: {
              restaurant_id: restaurant?.res_id,
            },
            token: user.token,
          };
          dispatch(get_RestauRantDetails(params));
         
       })

        setRating(0);
        setComment('');
    };


  
    


    return (
        <>
            <View style={styles.starRatingContainer}>
                {StarData.map((_, index) => (
                    <TouchableOpacity
                        style={{ marginLeft: 10 }}
                        key={index} onPress={() => setRating(index + 1)}>
                        {index < rating ? (
                            <Star height={25} width={25} />
                        ) : (
                            <DarkStar height={25} width={25} fill="#84888F" />
                        )}
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.commentContainer}>
                <TextInput
                    multiline
                    style={styles.commentInput}
                    placeholder="Comment your review."
                    value={comment}
                    onChangeText={(text) => setComment(text)}
                />
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={submitReview}>
                <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
        </>
    );
}

const styles = StyleSheet.create({
    reviewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 5,
        marginTop: 10,
    },
    reviewHeaderText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#101010',
    },
    reviewCount: {
        fontSize: 12,
        lineHeight: 18,
        marginLeft: 10,
        fontWeight: '700',
        color: '#000',
    },
    seeAllButton: {
        fontSize: 14,
        fontWeight: '500',
        color: '#E79B3F',
        lineHeight: 27,
    },
    reviewItem: {
        marginTop: 10,
        paddingVertical: 10,
        padding: 5,
        backgroundColor: '#F7F8F8',
        borderRadius: 10,
    },
    ratingDescription: {
        alignItems: 'center',
        marginTop: 10,
    },
    ratingDescriptionText: {
        fontSize: 14,
        lineHeight: 21,
        fontWeight: '400',
        color: '#677294',
    },
    starRatingContainer: {
        flexDirection: 'row',
        marginTop: 10,

        padding: 10,
        alignSelf: 'center'
    },
    commentContainer: {
        marginVertical: 10,
        paddingHorizontal: 10,
        backgroundColor: '#F7F8F8',
        borderRadius: 10,
    },
    commentInput: {
        fontSize: 16,
        fontStyle: '500',
        color: '#000',
    },
    submitButton: {
        backgroundColor: '#352C48',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        height: 60,
        marginTop: 20,
    },
    submitButtonText: {
        color: '#FFF',
        fontSize: 17,
        fontWeight: '600',
        lineHeight: 25.5,
    },
});
