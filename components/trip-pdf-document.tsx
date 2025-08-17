import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

// PDF styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  header: {
    textAlign: 'center',
    marginBottom: 30,
    borderBottom: '2 solid #10b981',
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#10b981',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#10b981',
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoColumn: {
    width: '48%',
  },
  infoLabel: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  infoValue: {
    marginBottom: 10,
    color: '#374151',
  },
  dayHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: '#10b981',
    color: 'white',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  itemCard: {
    border: '1 solid #e5e7eb',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  itemType: {
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    padding: '4 8',
    borderRadius: 4,
    fontSize: 10,
  },
  itemTime: {
    color: '#6b7280',
    fontSize: 10,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemDescription: {
    marginBottom: 10,
    color: '#374151',
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemLocation: {
    color: '#6b7280',
    fontSize: 10,
  },
  itemPrice: {
    color: '#10b981',
    fontWeight: 'bold',
  },
  summaryText: {
    marginBottom: 5,
    color: '#374151',
  },
  footer: {
    marginTop: 30,
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 10,
  },
  footerText: {
    marginBottom: 5,
  },
})

interface TripPDFDocumentProps {
  tripData: any
  itineraryItems: any[]
}

export function TripPDFDocument({ tripData, itineraryItems }: TripPDFDocumentProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (timeString: string) => {
    if (!timeString) return ''
    return timeString
  }

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`
  }

  const totalCost = itineraryItems.reduce((sum, item) => sum + (item.price || 0), 0)
  const totalDays = tripData.startDate && tripData.endDate 
    ? Math.ceil((new Date(tripData.endDate).getTime() - new Date(tripData.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1
    : itineraryItems.length > 0 ? Math.max(...itineraryItems.map(item => item.day)) : 1

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{tripData.name}</Text>
          <Text style={styles.subtitle}>Your Perfect Island Adventure</Text>
        </View>

        {/* Trip Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trip Overview</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoColumn}>
              <Text style={styles.infoLabel}>Start Date:</Text>
              <Text style={styles.infoValue}>
                {tripData.startDate ? formatDate(tripData.startDate) : 'Not specified'}
              </Text>
              <Text style={styles.infoLabel}>End Date:</Text>
              <Text style={styles.infoValue}>
                {tripData.endDate ? formatDate(tripData.endDate) : 'Not specified'}
              </Text>
              <Text style={styles.infoLabel}>Duration:</Text>
              <Text style={styles.infoValue}>{totalDays} day{totalDays > 1 ? 's' : ''}</Text>
            </View>
            <View style={styles.infoColumn}>
              <Text style={styles.infoLabel}>Travelers:</Text>
              <Text style={styles.infoValue}>{tripData.travelers || 1}</Text>
              <Text style={styles.infoLabel}>Budget:</Text>
              <Text style={styles.infoValue}>
                {tripData.budget ? formatPrice(tripData.budget) : 'Not specified'}
              </Text>
              <Text style={styles.infoLabel}>Total Cost:</Text>
              <Text style={styles.infoValue}>{formatPrice(totalCost)}</Text>
            </View>
          </View>
        </View>

        {/* Daily Itinerary */}
        {Array.from({ length: totalDays }, (_, day) => {
          const dayItems = itineraryItems.filter(item => item.day === day + 1).sort((a, b) => 
            (a.time || '').localeCompare(b.time || '')
          )
          
          if (dayItems.length === 0) return null
          
          return (
            <View key={day} style={styles.section}>
              <Text style={styles.dayHeader}>Day {day + 1}</Text>
              {dayItems.map((item, index) => (
                <View key={index} style={styles.itemCard}>
                  <View style={styles.itemHeader}>
                    <Text style={styles.itemType}>{item.type}</Text>
                    <Text style={styles.itemTime}>
                      {formatTime(item.time)} • {item.duration || 'Flexible'}
                    </Text>
                  </View>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemDescription}>{item.description || ''}</Text>
                  <View style={styles.itemFooter}>
                    <Text style={styles.itemLocation}>
                      📍 {item.location || 'Location not specified'}
                    </Text>
                    {item.price > 0 && (
                      <Text style={styles.itemPrice}>{formatPrice(item.price)}</Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )
        })}

        {/* Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trip Summary</Text>
          <Text style={styles.summaryText}>Total Activities: {itineraryItems.length}</Text>
          <Text style={styles.summaryText}>Total Cost: {formatPrice(totalCost)}</Text>
          <Text style={styles.summaryText}>Average Daily Cost: {formatPrice(totalCost / totalDays)}</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Generated by Lombok Island Travel Planner</Text>
          <Text style={styles.footerText}>Generated on {new Date().toLocaleDateString()}</Text>
        </View>
      </Page>
    </Document>
  )
}
