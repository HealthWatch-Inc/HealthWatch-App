import { StyleSheet } from 'react-native';

export const getNotificationsStyles = (Colors: any) => StyleSheet.create({
  medsContainer: {
    marginBottom: 16
  },
  medCard: {
    backgroundColor: Colors.primary,
    marginBottom: 12,
    width: '100%'
  },
  medContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8
  },
  medIcon: {
    margin: 0
  },
  medTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  },
  medTime: {
    color: 'white',
    fontSize: 14
  },
  medTextWrapper: {
    marginLeft: 4,
    flex: 1
  },
  deleteMedBtn: {
    margin: 0,
    padding: 0
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
    marginTop: 8
  },
  fallItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#CAC4D0'
  },
  emptyContainer: {
    paddingVertical: 24,
    alignItems: 'center'
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: '#E6E1E5',
    borderRadius: 20
  },
  saveButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: Colors.primary,
    borderRadius: 20
  },
});