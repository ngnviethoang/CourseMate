'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ShoppingBag, Trash2, ShoppingCart } from 'lucide-react'
import { studentService } from '@/lib/student-service'
import { CartDto } from '@/lib/types'
import { toast } from 'sonner'

export default function CartPage() {
  const router = useRouter()
  const [cart, setCart] = useState<CartDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [checkingOut, setCheckingOut] = useState(false)

  const fetchCart = () => {
    setLoading(true)
    studentService
      .getCart()
      .then(res => {
        setCart(res)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchCart()
  }, [])

  const handleRemove = async (cartItemId: string) => {
    setRemovingId(cartItemId)
    try {
      await studentService.removeFromCart(cartItemId)
      toast.success('Item removed from cart.')
      fetchCart()
    } catch {
      // handled by api-client
    } finally {
      setRemovingId(null)
    }
  }

  const handleCheckout = async () => {
    setCheckingOut(true)
    try {
      await studentService.createOrder()
      toast.success('Order placed successfully!')
      fetchCart()
      router.push('/orders')
    } catch {
      // handled by api-client
    } finally {
      setCheckingOut(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  const items = cart?.items ?? []

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-6 text-center">
        <ShoppingCart className="h-16 w-16 text-muted-foreground" />
        <h2 className="text-2xl font-semibold">Your cart is empty</h2>
        <p className="text-muted-foreground">Browse courses and add them to your cart.</p>
        <Button onClick={() => router.push('/')}>Explore Courses</Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <ShoppingBag className="h-7 w-7" />
          My Cart
        </h1>
        <p className="text-muted-foreground mt-1">
          {items.length} item{items.length !== 1 ? 's' : ''} in your cart
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          {items.map(item => (
            <Card key={item.id} className="flex flex-col sm:flex-row overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.courseImageUrl || 'https://placehold.co/200x150?text=Course'}
                alt={item.courseTitle}
                className="h-32 sm:w-36 w-full object-cover flex-shrink-0 bg-muted"
              />
              <CardContent className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold line-clamp-2">{item.courseTitle}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{item.instructorName}</p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-lg font-bold text-primary">${item.price.toFixed(2)}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-1"
                    onClick={() => handleRemove(item.id)}
                    disabled={removingId === item.id}
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="md:col-span-1">
          <Card className="sticky top-6">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-semibold">Order Summary</h2>
              <div className="space-y-2 text-sm">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between">
                    <span className="text-muted-foreground line-clamp-1 max-w-[60%]">{item.courseTitle}</span>
                    <span>${item.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="flex items-center justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary">${(cart?.totalPrice ?? 0).toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter className="p-6 pt-0">
              <Button className="w-full h-11 text-base" onClick={handleCheckout} disabled={checkingOut}>
                {checkingOut ? 'Processing...' : 'Checkout'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
